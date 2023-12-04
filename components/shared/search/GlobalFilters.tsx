"use client";

import { Button } from "@/components/ui/button";
import { GlobalSearchFilters } from "@/constants/filters";
import { formUrlQuery } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import React, { useState } from "react";

// 1. Build out the entire UI/UX -> FE
// 2. Build out the backend

// Build out some features of the frontend
// Connect with BE

const GlobalFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsFilter = searchParams.get("type") || "";
  const [active, setActive] = useState(paramsFilter || "");

  const handleTypeClick = (item: string) => {
    if (active === item) {
      setActive("");
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: null,
      });

      router.push(newUrl, { scroll: false });
    } else {
      setActive(item);
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: "type",
        value: item,
      });

      router.push(newUrl, { scroll: false });
    }
  };

  return (
    <div className="flex items-center gap-5 px-5">
      <p className="text-dark400_light900 body-medium">Type:</p>
      <div className="flex gap-3">
        {GlobalSearchFilters.map((item) => (
          <Button
            key={item.value + item.name}
            onClick={() => handleTypeClick(item.value)}
            type="button"
            className={`light-border-2 small-medium rounded-2xl px-5 py-2 capitalize ${
              active === item.value
                ? "bg-primary-500 text-light-900"
                : "bg-light-700  text-dark-400 hover:text-primary-500 dark:bg-dark-500 dark:text-light-800 dark:hover:text-primary-500"
            }`}>
            {item.name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default GlobalFilters;
