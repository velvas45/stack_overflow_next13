import Question from "@/components/forms/Question";
import { getQuestionById } from "@/lib/actions/question.action";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import React from "react";

const Page = async ({ params }: { params: { questionId: string } }) => {
  const { userId } = auth();

  // if (!userId) redirect("/sign-in");
  if (!userId) return null;

  const mongoUser = await getUserById({ userId });
  const result = await getQuestionById({ questionId: params.questionId });

  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Question</h1>
      <div className="mt-9">
        <Question
          mongoUserId={JSON.stringify(mongoUser?._id)}
          type="Edit"
          questionDetail={JSON.stringify(result.question)}
        />
      </div>
    </div>
  );
};

export default Page;
