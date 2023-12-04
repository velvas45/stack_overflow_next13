"use server";

import Question from "@/database/question.model";
import { connectToDatabase } from "../mongoose";
import { ViewQuestionParams } from "./shared.types";
import Interaction from "@/database/interaction.model";
import User from "@/database/user.model";

export async function viewQuestion(params: ViewQuestionParams) {
  try {
    await connectToDatabase();

    const { questionId, userId } = params;

    // Updated view count for the question
    const question = await Question.findByIdAndUpdate(questionId, {
      $inc: { views: 1 },
    }); // $inc -> untuk increment

    if (userId) {
      const existingInteraction = await Interaction.findOne({
        user: userId,
        action: "view",
        question: questionId,
      });

      if (existingInteraction) {
        return console.log("User has already viewed.");
      } else {
        console.log(JSON.stringify(userId), JSON.stringify(question.author));
        // Increment Reputation the question user by +2 if other ppl views the question
        // But not increment if user views is same with the author question
        if (JSON.stringify(userId) !== JSON.stringify(question.author))
          await User.findByIdAndUpdate(userId, {
            $inc: { reputation: 2 },
          });
      }

      // Create interaction
      await Interaction.create({
        user: userId,
        action: "view",
        question: questionId,
      });
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
}
