import React from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Metric from "../shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import { SignedIn } from "@clerk/nextjs";
import EditDeleteAction from "../shared/EditDeleteAction";

interface Tag {
  _id: number;
  name: string;
}

interface QuestionProps {
  _id: string | number;
  title: string;
  upvotes: string[];
  answers: Array<object>;
  views: number;
  tags: Tag[];
  author: {
    _id: string | number;
    name: string;
    picture: string;
    clerkId: string;
  };
  createdAt: Date;
  clerkId?: string | null;
}

const QuestionCard = ({
  title,
  _id,
  tags,
  upvotes,
  answers,
  views,
  author,
  createdAt,
  clerkId,
}: QuestionProps) => {
  const showActionButtons = clerkId && clerkId === author.clerkId;

  return (
    <Card className="card-wrapper rounded-[10px] border-none p-9 sm:px-11">
      <div className="flex flex-col-reverse items-start justify-between gap-5 sm:flex-row">
        <div>
          <span className="subtle-regular text-dark400_light700 line-clamp-1 flex sm:hidden">
            {getTimestamp(createdAt)}
          </span>
          <Link href={`/question/${_id}`}>
            <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
              {title}
            </h3>
          </Link>
        </div>

        {/* If signed in add (edit delete) actions */}
        <SignedIn>
          {showActionButtons && (
            <EditDeleteAction type="Question" itemId={JSON.stringify(_id)} />
          )}
        </SignedIn>
      </div>

      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
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
          <Metric
            imgUrl="/assets/icons/message.svg"
            alt="message"
            value={answers.length}
            title=" Answers"
            textStyles="small-medium text-dark400_light800"
          />
          <Metric
            imgUrl="/assets/icons/eye.svg"
            alt="eye"
            value={formatAndDivideNumber(views)}
            title=" Views"
            textStyles="small-medium text-dark400_light800"
          />
        </div>
      </div>
    </Card>
  );
};

export default QuestionCard;
