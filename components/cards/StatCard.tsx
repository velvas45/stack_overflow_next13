import { formatAndDivideNumber } from "@/lib/utils";
import Image from "next/image";
import React from "react";

interface StatCardProps {
  forBadge: boolean;
  urlBadge?: string;
  typeBadge?: string;
  totalQuestions?: number;
  totalAnswers?: number;
  totalBadges?: number;
}

const StatCard = ({
  forBadge,
  urlBadge,
  typeBadge,
  totalQuestions,
  totalAnswers,
  totalBadges,
}: StatCardProps) => {
  return (
    <div className="light-border background-light900_dark300 flex flex-wrap items-center justify-evenly gap-4 rounded-md border p-6 shadow-light-300 dark:shadow-dark-200">
      {forBadge ? (
        <>
          <div>
            <Image
              src={urlBadge!}
              width={40}
              height={50}
              alt={`${typeBadge} medal icon`}
            />
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalBadges!)}
            </p>
            <p className="body-medium text-dark400_light700">
              {typeBadge} Badges
            </p>
          </div>
        </>
      ) : (
        <>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalQuestions!)}
            </p>
            <p className="body-medium text-dark400_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatAndDivideNumber(totalAnswers!)}
            </p>
            <p className="body-medium text-dark400_light700">Answers</p>
          </div>
        </>
      )}
    </div>
  );
};

export default StatCard;
