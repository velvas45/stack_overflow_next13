import { getUserQuestions } from "@/lib/actions/user.action";
import React from "react";
import QuestionCard from "../cards/QuestionCard";
import { Button } from "../ui/button";
import { SearchParamsProps } from "@/types";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const QuestionTab = async ({ userId, searchParams, clerkId }: Props) => {
  const result = await getUserQuestions({
    userId,
    page: 1,
  });
  return (
    <>
      {result.questions.map((question) => (
        <QuestionCard
          key={question._id}
          _id={question._id}
          clerkId={clerkId}
          tags={question.tags}
          title={question.title}
          author={question.author}
          upvotes={question.upvotes}
          answers={question.answers}
          views={question.views}
          createdAt={question.createdAt}
        />
      ))}

      {result.totalQuestions >= 10 && (
        <div className="flex w-full items-center justify-center gap-2">
          <Button className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 border px-4 py-2">
            Prev
          </Button>
          <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
            <p className="body-semibold text-light-900">
              {searchParams.page || 1}
            </p>
          </div>
          <Button className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 border px-4 py-2">
            Next
          </Button>
        </div>
      )}
    </>
  );
};

export default QuestionTab;
