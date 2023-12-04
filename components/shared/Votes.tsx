"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import { viewQuestion } from "@/lib/actions/interaction.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { toggleSaveQuestion } from "@/lib/actions/user.action";
import { formatAndDivideNumber } from "@/lib/utils";
import { useAuth } from "@clerk/nextjs";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

interface Props {
  type: string;
  totalUpvote: number;
  totalDownVote: number;
  userId: string;
  itemId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
  clerkUserId: string;
}

const Votes = ({
  type,
  totalUpvote,
  totalDownVote,
  userId,
  itemId,
  hasupVoted,
  hasdownVoted,
  hasSaved,
  clerkUserId,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const { userId: clerkId } = useAuth();

  const handleSave = async () => {
    if (!userId) return;

    await toggleSaveQuestion({
      userId: JSON.parse(userId),
      questionId: JSON.parse(itemId),
      path: pathname,
    });
  };

  const handleVote = async (action: string) => {
    if (!userId) return;

    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }

      // TODO: Show Toast
    }

    if (action === "downvote") {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if (type === "Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
      // TODO: Show Toast
    }
  };

  useEffect(() => {
    viewQuestion({
      questionId: JSON.parse(itemId),
      userId: userId ? JSON.parse(userId) : undefined,
    });
  }, [itemId, userId, pathname, router]);

  if (clerkId === clerkUserId) {
    return null;
  }
  return (
    <div className="flex gap-5">
      <div className="flex-center gap-2.5">
        <div className="flex-center gap-1.5">
          <Image
            src={`${
              hasupVoted
                ? "/assets/icons/upvoted.svg"
                : "/assets/icons/upvote.svg"
            }`}
            width={18}
            height={18}
            alt="upvote"
            className={`cursor-pointer`}
            onClick={() => handleVote("upvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(totalUpvote)}
            </p>
          </div>
        </div>
        <div className="flex-center gap-1.5">
          <Image
            src={`${
              hasdownVoted
                ? "/assets/icons/downvoted.svg"
                : "/assets/icons/downvote.svg"
            }`}
            width={18}
            height={18}
            alt="downvotes"
            className={`cursor-pointer`}
            onClick={() => handleVote("downvote")}
          />
          <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
            <p className="subtle-medium text-dark400_light900">
              {formatAndDivideNumber(totalDownVote)}
            </p>
          </div>
        </div>
      </div>
      {type === "Question" && (
        <Image
          src={`${
            hasSaved
              ? "/assets/icons/star-filled.svg"
              : "/assets/icons/star-red.svg"
          }`}
          width={18}
          height={18}
          alt="star"
          className={`cursor-pointer`}
          onClick={() => handleSave()}
        />
      )}
    </div>
  );
};

export default Votes;
