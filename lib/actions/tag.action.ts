"use server";

import User from "@/database/user.model";
import { connectToDatabase } from "../mongoose";
import { GetAllTagsParams, GetTopInteractedTagsParams } from "./shared.types";
import Tag from "@/database/tag.model";

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
