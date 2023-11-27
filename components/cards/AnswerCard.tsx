import { getTimestamp, formatAndDivideNumber } from "@/lib/utils";
import { title } from "process";
import React from "react";
import Metric from "../shared/Metric";
import { Card } from "../ui/card";
import Link from "next/link";
import { Tag } from "lucide-react";
import { SignedIn, auth } from "@clerk/nextjs";
import DeleteButton from "../shared/DeleteButton";
import EditButton from "../shared/EditButton";
import EditDeleteAction from "../shared/EditDeleteAction";

interface AnswerProps {
  _id: string | number;
  question: {
    _id: string;
    title: string;
  };
  upvotes: string[];
  author: {
    _id: string | number;
    name: string;
    picture: string;
    clerkId: string;
  };
  createdAt: Date;
  clerkId?: string | null;
}

const AnswerCard = ({
  question,
  _id,
  upvotes,
  author,
  createdAt,
  clerkId,
}: AnswerProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <Card className="card-wrapper rounded-[10px] border-none p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${question?._id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {question?.title}
            </h3>
          </Link>
        </div>

        {/* If signed in add delete actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Answer" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>
      <div className="flex-between mt-6 flex-wrap gap-3">
        <Metric
          imgUrl={author.picture}
          alt="user"
          value={author.name}
          title={` - asked ${getTimestamp(createdAt)}`}
          href={`/profile/${author._id}`}
          isAuthor
          textStyles="body-medium text-dark400_light700"
        />
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <Metric
            imgUrl="/assets/icons/like.svg"
            alt="upvotes"
            value={formatAndDivideNumber(upvotes.length)}
            title=" Votes"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Card>
  );
};

export default AnswerCard;
