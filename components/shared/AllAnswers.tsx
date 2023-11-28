import React from "react";
import Filter from "./Filter";
import { AnswerFilters } from "@/constants/filters";
import { getAnswers } from "@/lib/actions/answer.action";
import Link from "next/link";
import Image from "next/image";
import { getTimestamp } from "@/lib/utils";
import ParseHTML from "./ParseHTML";
import Votes from "./Votes";
import Pagination from "./Pagination";

interface Props {
  questionId: string;
  authorId: string;
  totalAnswer: number;
  page?: number;
  filter?: string;
}

const AllAnswers = async ({
  questionId,
  authorId,
  totalAnswer,
  page,
  filter,
}: Props) => {
  const result = await getAnswers({
    questionId,
    sortBy: filter,
    page: page ? +page : 1,
  });
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient ">{totalAnswer} Answers</h3>
        <Filter placeholder="Select a filter" filters={AnswerFilters} />
      </div>
      <div>
        {result.answers.map((answer) => (
          <article key={answer._id} className="light-border border-b py-10">
            {/* SPAN ID */}
            <div className="mb-8 flex flex-col-reverse justify-between gap-5 sm:flex-row sm:items-center sm:gap-2">
              <Link
                href={`/profile/${answer.author.clerkId}`}
                className="flex flex-1 items-center gap-1 sm:items-center">
                <Image
                  src={answer.author.picture}
                  alt={answer.author.name}
                  width={18}
                  height={18}
                  className="rounded-full object-cover max-sm:mt-0.5"
                />
                <div className="flex flex-col sm:flex-row sm:items-center">
                  <p className="body-semibold text-dark300_light700 ">
                    {answer.author.name}
                  </p>
                  <p className="small-regular text-light400_light500 ml-0.5 mt-0.5 line-clamp-1">
                    answered {getTimestamp(answer.createdAt)}
                  </p>
                </div>
              </Link>
              <div className="flex justify-end">
                <Votes
                  totalUpvote={answer.upvotes.length}
                  totalDownVote={answer.downvotes.length}
                  type="Answer"
                  itemId={JSON.stringify(answer._id)}
                  userId={JSON.stringify(authorId)}
                  hasupVoted={answer.upvotes.includes(authorId)}
                  hasdownVoted={answer.downvotes.includes(authorId)}
                />
              </div>
            </div>
            <ParseHTML data={answer.content} />
          </article>
        ))}
      </div>
      <div className="mt-10">
        <Pagination pageNumber={page ? +page : 1} isNext={result.isNext} />
      </div>
    </div>
  );
};

export default AllAnswers;
