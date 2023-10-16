import HomeFilters from "@/components/home/HomeFilters";
import QuestionCard from "@/components/cards/QuestionCard";
import Filter from "@/components/shared/Filter";
import NoResult from "@/components/shared/NoResult";
import LocalSearchBar from "@/components/shared/search/LocalSearchBar";
import { Button } from "@/components/ui/button";
import { HomePageFilters } from "@/constants/filters";
import Link from "next/link";

export default function Home() {
  const questionsData = [
    {
      _id: 1,
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
      tags: [
        {
          _id: 2,
          name: "NEXT.JS",
        },
      ],
      upvotes: 24,
      answers: [],
      views: 10031000,
      author: {
        _id: 1,
        name: "Helmi Agustiawan",
        picture: "https://placehold.co/600x400/000000/FFFFFF.png",
      },
      createdAt: new Date("2021-09-03T12:00:00.000Z"),
    },
    {
      _id: 2,
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
      upvotes: 24,
      answers: [],
      views: 1200,
      tags: [
        {
          _id: 2,
          name: "NEXT.JS",
        },
      ],
      author: {
        _id: 1,
        name: "Helmi Agustiawan",
        picture: "https://placehold.co/600x400/000000/FFFFFF.png",
      },
      createdAt: new Date("2021-09-03T12:00:00.000Z"),
    },
    {
      _id: 3,
      title:
        "Best practices for data fetching in a Next.js application with Server-Side Rendering (SSR)?",
      upvotes: 24,
      answers: [],
      views: 1200,
      tags: [
        {
          _id: 2,
          name: "NEXT.JS",
        },
      ],
      author: {
        _id: 1,
        name: "Helmi Agustiawan",
        picture: "https://placehold.co/600x400/000000/FFFFFF.png",
      },
      createdAt: new Date("2021-09-03T12:00:00.000Z"),
    },
  ];

  return (
    <>
      <div className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Link href="/ask-question" className="flex justify-end max-sm:w-full">
          <Button className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900">
            Ask a Question
          </Button>
        </Link>
      </div>
      <div className="mt-11 flex justify-between gap-5 max-sm:flex-col sm:items-center">
        <LocalSearchBar
          route="/"
          iconPosition="right"
          placeholder="Search for questions"
          imgSrc="/assets/icons/search.svg"
          otherClasses="flex-1"
        />{" "}
        <Filter
          filters={HomePageFilters}
          placeholder="Select a Filter"
          otherClasses="min-h-[56px] sm:min-w-[170px]"
          containerClasses="hidden max-md:flex"
        />
      </div>

      <HomeFilters />

      {/* Question Card */}
      <div className="mt-10 flex w-full flex-col gap-6">
        {questionsData.length > 0 ? (
          questionsData?.map((question) => (
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
            title="There’s no question to show"
            description="Be the first to break the silence! 🚀 Ask a Question and kickstart the
            discussion. our query could be the next big thing others learn from. Get
            involved! 💡"
            link="/ask-question"
            linkTitle="Ask a Question"
          />
        )}
      </div>
    </>
  );
}
