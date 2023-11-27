import { getUserAnswers } from "@/lib/actions/user.action";
import { SearchParamsProps } from "@/types";
import { Button } from "../ui/button";
import AnswerCard from "../cards/AnswerCard";

interface Props extends SearchParamsProps {
  userId: string;
  clerkId?: string | null;
}

const AnswerTab = async ({ userId, searchParams, clerkId }: Props) => {
  const result = await getUserAnswers({
    userId,
    page: 1,
  });
  return (
    <>
      {result.answers.map((answer) => (
        <AnswerCard
          key={answer._id}
          _id={answer._id}
          clerkId={clerkId}
          question={answer.question}
          author={answer.author}
          upvotes={answer.upvotes}
          createdAt={answer.createdAt}
        />
      ))}

      {result.totalAnswers >= 10 && (
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

export default AnswerTab;
