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
import console from "console";
import { BadgeCriteriaType } from "@/types";
import { assignBadges } from "../utils";

export async function getAllUsers(params: GetAllUsersParams) {
  try {
    connectToDatabase();

    const { page = 1, pageSize = 10, filter, searchQuery } = params;

    // Calculate the number of posts to skip based on the page number and page size
    const skipAmount = (page! - 1) * pageSize!;

    const query: FilterQuery<typeof User> = {};
    let sortOptions = {};

    if (searchQuery) {
      query.$or = [
        { name: { $regex: new RegExp(searchQuery, "i") } },
        { username: { $regex: new RegExp(searchQuery, "i") } },
      ];
    }

    switch (filter) {
      case "new_users":
        sortOptions = { joinedAt: -1 };
        break;
      case "old_users":
        sortOptions = { joinedAt: 1 };
        break;
      case "top_contributors":
        sortOptions = { reputation: -1 };
        break;

      default:
        break;
    }

    const users = await User.find(query)
      .skip(skipAmount)
      .limit(pageSize!)
      .sort(sortOptions);

    const totalUsers = await User.countDocuments(query);

    const isNext = totalUsers > skipAmount + users.length;

    return { users, isNext };
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

    const { clerkId, page = 1, pageSize = 1, searchQuery, filter } = params;

    // Calculate the number of posts to skip based on the page number and page size
    const skipAmount = (page! - 1) * pageSize!;

    let sortOptions = {};

    // query Search
    const query: FilterQuery<typeof Question> = searchQuery
      ? { title: { $regex: new RegExp(searchQuery, "i") } }
      : {};

    // Filter
    switch (filter) {
      case "most_recent":
        sortOptions = { createdAt: -1 };
        break;
      case "oldest":
        sortOptions = { createdAt: 1 };
        break;
      case "most_viewed":
        sortOptions = { views: -1 };
        break;
      case "most_voted":
        sortOptions = { upvotes: -1 };
        break;
      case "most_answered":
        sortOptions = { answers: -1 };
        break;

      default:
        break;
    }

    const user = await User.findOne({ clerkId }).populate({
      path: "saved",
      match: query,
      model: Question,
      options: {
        skip: skipAmount,
        limit: pageSize! + 1,
        sort: sortOptions,
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

    const isNext = savedQuestions.length > pageSize;

    return { questions: savedQuestions, isNext };
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

    const [questionUpvotes] = await Question.aggregate([
      {
        $match: {
          author: user._id,
        },
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: {
            $sum: "$upvotes",
          },
        },
      },
    ]);
    const [answerUpvotes] = await Answer.aggregate([
      {
        $match: {
          author: user._id,
        },
      },
      {
        $project: {
          _id: 0,
          upvotes: { $size: "$upvotes" },
        },
      },
      {
        $group: {
          _id: null,
          totalUpvotes: {
            $sum: "$upvotes",
          },
        },
      },
    ]);
    const [questionViews] = await Answer.aggregate([
      {
        $match: {
          author: user._id,
        },
      },
      {
        $group: {
          _id: null,
          totalViews: {
            $sum: "$views",
          },
        },
      },
    ]);

    const criteria = [
      { type: "QUESTION_COUNT" as BadgeCriteriaType, count: totalQuestions },
      { type: "ANSWER_COUNT" as BadgeCriteriaType, count: totalAnswers },
      {
        type: "QUESTION_UPVOTES" as BadgeCriteriaType,
        count: questionUpvotes?.totalUpvotes || 0,
      },
      {
        type: "ANSWER_UPVOTES" as BadgeCriteriaType,
        count: answerUpvotes?.totalUpvotes || 0,
      },
      {
        type: "TOTAL_VIEWS" as BadgeCriteriaType,
        count: questionViews?.totalViews || 0,
      },
    ];

    const badgeCounts = assignBadges({ criteria });

    return {
      user,
      totalQuestions,
      totalAnswers,
      badgeCounts,
      reputation: user.reputation,
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
      .sort({ createdAt: -1, views: -1, upvotes: -1 })
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

    const isNext = totalQuestions > skipCount + questions.length;

    return {
      questions,
      totalQuestions,
      isNext,
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

    const { userId, page = 1, pageSize = 1 } = params;

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

    const isNext = totalAnswers > skipCount + answers.length;

    return {
      answers,
      totalAnswers,
      isNext,
    };
  } catch (error) {
    console.log(error);
    throw error;
  }
}
