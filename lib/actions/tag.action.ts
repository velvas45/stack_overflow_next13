"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import {
  GetAllTagsParams,
  GetQuestionsByTagIdParams,
  GetTopInteractedTagsParams,
} from "./shared.types";
import Tag, { ITag } from "@/database/tag.model";
import Question from "@/database/question.model";
import { FilterQuery } from "mongoose";
import console from "console";

export async function getTopInteractedTags(params: GetTopInteractedTagsParams) {
  try {
    connectToDatabase();

    const { userId } = params;

    const user = await User.findById(userId);

    if (!user) return new Error("User not found!");

    // Find interactions for the users and group by tags...
    // Interaction...

    return [
      { _id: "1", name: "Tag 1" },
      { _id: "2", name: "Tag 2" },
    ];
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getAllTags(params: GetAllTagsParams) {
  try {
    connectToDatabase();

    // const { page = 1, pageSize = 10, filter, searchQuery } = params;

    const tags = await Tag.find({});

    return tags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function GetQuestionsByTagId(params: GetQuestionsByTagIdParams) {
  try {
    // connect to DB
    connectToDatabase();

    // eslint-disable-next-line no-unused-vars
    const { tagId, page = 1, pageSize = 10, searchQuery } = params;

    const tagFilter: FilterQuery<ITag> = { _id: tagId };

    const tags = await Tag.findOne(tagFilter).populate({
      path: "questions",
      model: Question,
      match: searchQuery
        ? { title: { $regex: searchQuery, $options: "i" } }
        : {},
      options: {
        sort: { createdAt: -1 },
      },
      populate: [
        { path: "tags", model: Tag, select: " _id name" },
        { path: "author", model: User, select: "_id clerkId name picture" },
      ],
    });

    if (!tags) {
      // throw ('No Tag Found!')
    }

    const questions = tags?.questions;

    return { tagTitle: tags?.name, questions };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getTopPopularTags() {
  try {
    // connect to DB
    connectToDatabase();

    // const tags = await Tag.find({}).sort({ questions: -1 }).limit(5);
    // menggunakan aggregate function
    const popularTags = await Tag.aggregate([
      { $project: { name: 1, numberOfQuestions: { $size: "$questions" } } },
      { $sort: { numberOfQuestions: -1 } },
      { $limit: 5 },
    ]);

    // return tags;
    return popularTags;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
