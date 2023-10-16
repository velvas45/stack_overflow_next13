import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import RenderTag from "../shared/RenderTag";
import Image from "next/image";
import Metric from "../shared/Metric";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";

interface Tag {
  _id: number;
  name: string;
}

interface QuestionProps {
  _id: string | number;
  title: string;
  upvotes: number;
  answers: Array<object>;
  views: number;
  tags: Tag[];
  author: {
    _id: string | number;
    name: string;
    picture: string;
  };
  createdAt: Date;
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
}: QuestionProps) => {
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

        {/* If signed in add edit delete actions */}
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 flex-wrap gap-3">
        <Metric
          imgUrl="/assets/icons/avatar.svg"
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
            value={formatAndDivideNumber(upvotes)}
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
      {/* <div>
        <Link href={`/`}>
          <h3 className="sm:h3-semibold base-semibold text-dark200_light900 line-clamp-1 flex-1">
            {title}
          </h3>
        </Link>
      </div>
      <div className="mt-3.5 flex flex-wrap gap-2">
        {tags.map((tag: Tag) => (
          <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
        ))}
      </div>
      <div className="flex-between mt-6 flex-wrap gap-3">
        <Link className="flex-center gap-1" href={`/profile/user`}>
          <Avatar className="h-4 w-4">
            <AvatarImage
              src={author.picture}
              alt={author.name}
              width={16}
              height={16}
            />
            <AvatarFallback>{author.name}</AvatarFallback>
          </Avatar>
          <p className="small-medium text-dark400_light800 flex items-center gap-1">
            {author.name}
            <span className="small-regular line-clamp-1">• testing</span>
          </p>
        </Link>
        <div className="flex items-center gap-3 max-sm:flex-wrap max-sm:justify-start">
          <div className="flex-center flex-wrap gap-1">
            <Image
              src="/assets/icons/like.svg"
              width={16}
              height={16}
              alt="like icon"
            />
            <p className="small-medium text-dark400_light800 flex items-center gap-1">
              {upvotes}
              <span className="small-regular line-clamp-1">upvotes</span>
            </p>
          </div>
          <div className="flex-center flex-wrap gap-1">
            <Image
              src="/assets/icons/message.svg"
              width={16}
              height={16}
              alt="message icon"
            />
            <p className="small-medium text-dark400_light800 flex items-center gap-1">
              {answers}
              <span className="small-regular line-clamp-1">Answer</span>
            </p>
          </div>
          <div className="flex-center flex-wrap gap-1">
            <Image
              src="/assets/icons/eye.svg"
              width={16}
              height={16}
              alt="eye icon"
            />
            <p className="small-medium text-dark400_light800 flex items-center gap-1">
              {views}
              <span className="small-regular line-clamp-1">Views</span>
            </p>
          </div>
        </div>
      </div> */}
    </Card>
  );
};

export default QuestionCard;
