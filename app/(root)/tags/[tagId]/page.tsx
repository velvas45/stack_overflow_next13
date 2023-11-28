import QuestionCard from "@/components/cards/QuestionCard";
import NoResult from "@/components/shared/NoResult";
import Pagination from "@/components/shared/Pagination";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { GetQuestionsByTagId } from "@/lib/actions/tag.action";
import React from "react";

const Page = async ({
  params,
  searchParams,
}: {
  params: { tagId: string };
  searchParams: { q: string; page: string };
}) => {
  const { tagId } = params;
  const { tagTitle, questions, isNext } = await GetQuestionsByTagId({
    tagId,
    searchQuery: searchParams.q,
    page: searchParams.page ? +searchParams.page : 1,
  });
  return (
    <>
      <h1 className="h1-bold text-dark100_light900">
        {tagTitle || "Tag Not Found"}
      </h1>

      <div className="mt-11 w-full">
        <LocalSearchBar
          route={`/tags/${tagId}`}
          iconPosition="right"
          placeholder="Search tag questions"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />
      </div>

      {/* Question Card */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {questions?.length > 0 ? (
          questions?.map((question: any) => (
            <QuestionCard
              key={question._id}
              _id={question._id}
              tags={question.tags}
              title={question.title}
              author={question.author}
              upvotes={question.upvotes}
              answers={question.answers}
              views={question.views}
              createdAt={question.createdAt}
            />
          ))
        ) : (
          <NoResult
            title="There’s no tag question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>

      <div className="mt-10">
        <Pagination
          pageNumber={searchParams?.page ? +searchParams.page : 1}
          isNext={isNext}
        />
      </div>
    </>
  );
};

export default Page;
