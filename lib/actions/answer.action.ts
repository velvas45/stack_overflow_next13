"use server";

import Question from "@/database/question.model";
import { revalidatePath } from "next/cache";
import { connectToDatabase } from "../mongoose";
import { CreateAnswerParams, GetAnswersParams } from "./shared.types";
import Answer from "@/database/answer.model";
import User from "@/database/user.model";

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
    await Question.findOneAndUpdate(
      { _id: question },
      { $push: { answers: newAnswer._id } },
      { upsert: true, new: true }
    );

    // TODO: ADD INTERACTION

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

    const { questionId, sortBy, page, pageSize } = params;

    //    Find Data
    const answers = await Answer.find({ quetion: questionId })
      //   .populate({
      //     path: "author",
      //     model: User,
      //     select: "_id clerkId name picture",
      //   })
      .populate("author", "_id clerkId name picture")
      .sort({ createdAt: -1 });

    return { answers };
  } catch (error) {
    console.log(error);
    throw error;
  }
}