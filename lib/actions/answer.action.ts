/* eslint-disable no-unused-vars */
"use server";

import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import {
  AnswerVoteParams,
  CreateAnswerParams,
  DeleteAnswerParams,
  GetAnswersParams,
} from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";
import Interaction from "@/database/interaction.model";

export async function createAnswer(params: CreateAnswerParams) {
  // eslint-disable-next-line no-empty
  try {
    // connect to DB
    connectToDatabase();

    const { content, question, author, path } = params;

    // Create Answer
    const newAnswer = await Answer.create({
      question,
      content,
      author,
    });
    // const newAnswer = new Answer({
    //   question,
    //   content,
    //   author,
    // });

    // Save Answer Data
    // newAnswer.save();

    // Add the answer to the question's answer array
    const questionObject = await Question.findOneAndUpdate(
      { _id: question },
      { $push: { answers: newAnswer._id } },
      { upsert: true, new: true }
    );

    // Create an interaction record for the user's create_answer action
    await Interaction.create({
      user: author,
      action: "answer",
      question,
      answer: newAnswer._id,
      tags: questionObject.tags,
    });
    // Add Reputation user +5 in create answer
    await User.findByIdAndUpdate(author, {
      $inc: { reputation: 5 },
    });
    // revalidate cache
    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAnswers(params: GetAnswersParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { questionId, sortBy, page = 1, pageSize = 10 } = params;
    const skipAmount = (page - 1) * pageSize;
    let sortOptions = {};

    switch (sortBy) {
      case "highestUpvotes":
        sortOptions = { upvotes: -1 };
        break;
      case "lowestUpvotes":
        sortOptions = { upvotes: 1 };
        break;
      case "recent":
        sortOptions = { createdAt: -1 };
        break;
      case "old":
        sortOptions = { createdAt: 1 };
        break;

      default:
        break;
    }

    //    Find Data
    const answers = await Answer.find({ question: questionId })
      //   .populate({
      //     path: "author",
      //     model: User,
      //     select: "_id clerkId name picture",
      //   })
      .populate("author", "_id clerkId name picture")
      .skip(skipAmount)
      .limit(pageSize!)
      .sort({ createdAt: -1 });

    const totalAnswer = await Answer.countDocuments({ question: questionId });

    const isNext = totalAnswer > skipAmount + answers.length;

    return { answers, isNext };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function upvoteAnswer(params: AnswerVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
      };
    } else if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
        $push: { upvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { upvotes: userId },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    // Increment author's reputation by +1/-1 for upvoting/revoking an upvote to the answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasupVoted ? -2 : 2 },
    });

    // Increment author's reputation by +10/-10 for receiving an upvote/revoking an upvote/downvote to the answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasupVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downvoteAnswer(params: AnswerVoteParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { answerId, userId, hasdownVoted, hasupVoted, path } = params;

    let updateQuery = {};

    if (hasdownVoted) {
      updateQuery = {
        $pull: { downvotes: userId },
      };
    } else if (hasupVoted) {
      updateQuery = {
        $pull: { upvotes: userId },
        $push: { downvotes: userId },
      };
    } else {
      updateQuery = {
        $addToSet: { downvotes: userId },
      };
    }

    const answer = await Answer.findByIdAndUpdate(answerId, updateQuery, {
      new: true,
    });

    if (!answer) throw new Error("Answer not found");

    // Increment author's reputation by +1/-1 for downvote/revoking an downvote to the answer
    await User.findByIdAndUpdate(userId, {
      $inc: { reputation: hasdownVoted ? -2 : 2 },
    });

    // Increment author's reputation by +10/-10 for receiving an downvote/revoking to the answer
    await User.findByIdAndUpdate(answer.author, {
      $inc: { reputation: hasdownVoted ? -10 : 10 },
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteAnswer(params: DeleteAnswerParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { answerId, path } = params;

    const answer = await Answer.findById(answerId);

    if (!answer) {
      throw new Error("Answer not found!");
    }

    await answer.deleteOne({ _id: answerId });
    await Question.updateMany(
      { _id: answer.question },
      { $pull: { answer: answerId } }
    );

    revalidatePath(path);
  } catch (error) {
    console.log(error);
  }
}
