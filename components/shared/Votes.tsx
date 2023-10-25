/* eslint-disable no-constant-condition */
"use client";

import { downvoteAnswer, upvoteAnswer } from "@/lib/actions/answer.action";
import {
  downvoteQuestion,
  upvoteQuestion,
} from "@/lib/actions/question.action";
import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import { usePathname } from "next/navigation";

interface Props {
  type: string;
  totalUpvote: number;
  totalDownVote: number;
  userId: string;
  itemId: string;
  hasupVoted: boolean;
  hasdownVoted: boolean;
  hasSaved?: boolean;
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
}: Props) => {
  const pathname = usePathname();
  const handleSave = () => {};

  const handleVote = async (action: string) => {
    if (action === "upvote") {
      if (type === "Question") {
        await upvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if ("Answer") {
        await upvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
    } else {
      if (type === "Question") {
        await downvoteQuestion({
          questionId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      } else if ("Answer") {
        await downvoteAnswer({
          answerId: JSON.parse(itemId),
          userId: JSON.parse(userId),
          hasupVoted,
          hasdownVoted,
          path: pathname,
        });
      }
    }
  };

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
