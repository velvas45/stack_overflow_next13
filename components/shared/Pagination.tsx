"use client";

import React from "react";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

const Pagination = ({
  pageNumber,
  isNext,
}: {
  pageNumber: number;
  isNext?: boolean;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleNavigation = (direction: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "page",
      value:
        direction === "next"
          ? (pageNumber + 1).toString()
          : (pageNumber - 1).toString(),
    });
    router.push(newUrl);
  };

  if (!isNext && pageNumber === 1) return null;

  return (
    <div className="flex w-full items-center justify-center gap-2">
      <Button
        onClick={() => handleNavigation("prev")}
        disabled={pageNumber === 1}
        className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 border px-4 py-2">
        Prev
      </Button>
      <div className="flex items-center justify-center rounded-md bg-primary-500 px-3.5 py-2">
        <p className="body-semibold text-light-900">{pageNumber || 1}</p>
      </div>
      <Button
        onClick={() => handleNavigation("next")}
        disabled={!isNext}
        className="light-border-2 btn flex h-9 min-h-[36px] items-center justify-center gap-2 border px-4 py-2">
        Next
      </Button>
    </div>
  );
};

export default Pagination;
