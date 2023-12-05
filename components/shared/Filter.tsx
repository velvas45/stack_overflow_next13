"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectGroup,
  SelectValue,
} from "@/components/ui/select";
import { formUrlQuery } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

type filter = {
  name: string;
  value: string;
};

interface FilterProps {
  placeholder?: string;
  filters: filter[];
  otherClasses?: string;
  containerClasses?: string;
}

const Filter = ({
  placeholder,
  filters,
  otherClasses,
  containerClasses,
}: FilterProps) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const paramsFilter = searchParams.get("filter") || "";

  const handleUpdateParams = (value: string) => {
    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: "filter",
      value,
    });
    router.push(newUrl, { scroll: false });
  };

  return (
    <div className={`relative ${containerClasses}`}>
      <Select onValueChange={handleUpdateParams} defaultValue={paramsFilter}>
        <SelectTrigger
          className={`${otherClasses} light-border body-regular background-light800_dark300 text-dark500_light700 border px-5 py-2.5 `}>
          <div className="line-clamp-1 flex-1 text-left">
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent className="text-dark500_light700 small-regular border-none bg-light-900 dark:bg-dark-300">
          <SelectGroup>
            {filters.map((opt) => (
              <SelectItem
                key={opt.value}
                value={opt.value}
                className="cursor-pointer focus:bg-light-800 dark:focus:bg-dark-400">
                {opt.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Filter;
