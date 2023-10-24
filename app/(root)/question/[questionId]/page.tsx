import RenderTag from "@/components/shared/RenderTag";
import { getQuestionById } from "@/lib/actions/question.action";
import { formatAndDivideNumber, getTimestamp } from "@/lib/utils";
import React from "react";
import Image from "next/image";
import Metric from "@/components/shared/Metric";
import Link from "next/link";
import ParseHTML from "@/components/shared/ParseHTML";
import Answer from "@/components/forms/Answer";
import { auth } from "@clerk/nextjs";
import { getUserById } from "@/lib/actions/user.action";
import AllAnswers from "@/components/shared/AllAnswers";
import Votes from "@/components/shared/Votes";

const Page = async ({ params, searchParams }) => {
  const { questionId } = params;
  const { userId: clerkId } = auth();

  let mongoUser;

  if (clerkId) {
    mongoUser = await getUserById({ userId: clerkId });
  }
  const { question } = await getQuestionById({ questionId });
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
          <Link
            href={`/profile/${question.author.clerkId}`}
            className="flex items-center justify-start gap-1">
            <Image
              src={question.author.picture}
              width={22}
              height={22}
              alt={question.author.name}
              className={`rounded-full`}
            />
            <p className="paragraph-semibold text-dark300_light700">
              {question.author.name}
            </p>
          </Link>
          <div className="flex justify-end">
            <div className="flex gap-5">
              {/* Voting Feature */}
              {/* TODO: Create Upvoted and Downvoted Component */}
              <Votes />
              {/* <div className="flex-center gap-2.5">
                <div className="flex-center gap-1.5">
                  <Image
                    src={`${
                      question.downvotes.length > 0
                        ? "/assets/icons/upvoted.svg"
                        : "/assets/icons/upvote.svg"
                    }`}
                    width={18}
                    height={18}
                    alt="upvote"
                    className={`cursor-pointer`}
                  />
                  <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                      {question.upvotes.length}
                    </p>
                  </div>
                </div>
                <div className="flex-center gap-1.5">
                  <Image
                    src={`${
                      question.downvotes.length > 0
                        ? "/assets/icons/downvoted.svg"
                        : "/assets/icons/downvote.svg"
                    }`}
                    width={18}
                    height={18}
                    alt="downvotes"
                    className={`cursor-pointer`}
                  />
                  <div className="flex-center background-light700_dark400 min-w-[18px] rounded-sm p-1">
                    <p className="subtle-medium text-dark400_light900">
                      {question.downvotes.length}
                    </p>
                  </div>
                </div>
              </div> */}
              <Image
                src="/assets/icons/star-red.svg"
                width={18}
                height={18}
                alt="star"
                className={`cursor-pointer`}
              />
            </div>
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full text-left">
          {question.title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/assets/icons/clock.svg"
          alt="clock"
          value={` asked ${getTimestamp(question.createdAt)}`}
          title=" Votes"
          textStyles="small-regular text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/message.svg"
          alt="message"
          value={question.answers.length}
          title=" Answers"
          textStyles="small-regular text-dark400_light800"
        />

        <Metric
          imgUrl="/assets/icons/eye.svg"
          alt="eye"
          value={formatAndDivideNumber(question.views)}
          title=" Views"
          textStyles="small-regular text-dark400_light800"
        />
      </div>

      {/* ParseHTML */}
      <ParseHTML data={question.content} />
      {/* Tags */}
      <div className="mt-8 flex flex-wrap gap-2">
        {question.tags.length > 0 &&
          question.tags.map((tag) => (
            <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
          ))}
      </div>

      {/* Answer List */}
      <AllAnswers
        authorId={JSON.stringify(mongoUser._id)}
        questionId={question._id}
        totalAnswer={question.answers.length}
      />

      {/* Form Answer */}
      <Answer
        question={question.content}
        authorId={JSON.stringify(mongoUser._id)}
        questionId={JSON.stringify(question._id)}
      />
    </>
  );
};

export default Page;
