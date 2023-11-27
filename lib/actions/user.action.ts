/* eslint-disable no-unused-vars */
"use server";

import { FilterQuery } from "mongoose";
import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  CreateUserParams,
  DeleteUserParams,
  GetAllUsersParams,
  GetSavedQuestionsParams,
  GetUserByIdParams,
  GetUserStatsParams,
  ToggleSaveQuestionParams,
  UpdateUserParams,
} from "./shared.types";
import { revalidatePath } from "next/cache";
import Question from "@/database/question.model";
import Tag from "@/database/tag.model";
import Answer from "@/database/answer.model";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 20, filter, searchQuery } = params;

    const users = await User.find({}).sort({ createdAt: -1 });

    return users;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserById(params: any) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });
    return user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function createUser(userParams: CreateUserParams) {
  try {
    connectToDatabase();
    const newUser = await User.create(userParams);

    return newUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function updateUser(params: UpdateUserParams) {
  try {
    connectToDatabase();

    const { clerkId, updateData, path } = params;

    await User.findOneAndUpdate({ clerkId }, updateData, { new: true });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function deleteUser(params: DeleteUserParams) {
  try {
    connectToDatabase();

    const { clerkId } = params;

    const user = await User.findOneAndDelete({ clerkId });

    if (!user) {
      throw new Error("User not found");
    }

    // Delete user from database;
    // and questions,answers,comments,etc

    // get user question ids
    // eslint-disable-next-line no-unused-vars
    const userQuestionIds = await Question.find({ author: user._id }).distinct(
      "_id"
    );

    // delete user question
    await Question.deleteMany({ author: user._id });

    // TODO: Delete user answers, comment, etc

    const deletedUser = await User.findByIdAndDelete(user._id);
    return deletedUser;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function toggleSaveQuestion(params: ToggleSaveQuestionParams) {
  try {
    connectToDatabase();

    const { userId, questionId, path } = params;

    // Find Data User
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    // Checking If User Already have question in collection saved data
    const isQuestionSaved = user.saved.includes(questionId);

    let updateQuery = {};

    if (isQuestionSaved) {
      updateQuery = {
        $pull: { saved: questionId },
      };
    } else {
      updateQuery = {
        $addToSet: { saved: questionId },
      };
    }

    // Update Data User
    await User.findByIdAndUpdate(userId, updateQuery, {
      new: true,
    });

    revalidatePath(path);
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getSavedQuestions(params: GetSavedQuestionsParams) {
  try {
    connectToDatabase();

    const { clerkId, page = 1, pageSize = 10, searchQuery } = params;

    // query filter
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      model: Question,
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        {
          path: "tags",
          model: Tag,
        },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!user) {
      throw new Error("User not found!");
    }

    const savedQuestions = user.saved;

    return { questions: savedQuestions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserInfo(params: GetUserByIdParams) {
  try {
    connectToDatabase();

    const { userId } = params;
    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found!");

    // Get Total Question and answer for spesific user has created
    const totalQuestions = await Question.countDocuments({ author: user._id });
    const totalAnswers = await Answer.countDocuments({ author: user._id });

    return {
      user,
      totalQuestions,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserQuestions(params: GetUserStatsParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    // get question for user
    const skipCount = (page! - 1) * pageSize!;

    const questions = await Question.find({ author: userId })
      .sort({ views: -1, upvotes: -1 })
      .skip(skipCount)
      .limit(pageSize!)
      .populate([
        {
          path: "tags",
          model: Tag,
        },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ]);

    // get total questions
    const totalQuestions = await Question.countDocuments({
      author: userId,
    });

    return {
      questions,
      totalQuestions,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getUserAnswers(params: GetUserStatsParams) {
  try {
    // connect to DB
    connectToDatabase();

    const { userId, page = 1, pageSize = 10 } = params;

    // get answer for user
    const skipCount = (page! - 1) * pageSize!;

    const answers = await Answer.find({ author: userId })
      .sort({ upvotes: -1 })
      .skip(skipCount)
      .limit(pageSize!)
      .populate([
        { path: "author", model: User, select: "_id clerkId name picture" },
        { path: "question", model: Question, select: "_id title" },
      ]);

    // get total answers
    const totalAnswers = await Answer.countDocuments({
      author: userId,
    });

    return {
      answers,
      totalAnswers,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
