import { hotNetworks, popularTags } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "./RenderTag";

const RightSidebar = () => {
  return (
    <section className="custom-scrollbar background-light900_dark200 light-border sticky right-0 top-0 flex h-screen w-[350px] flex-col gap-6 overflow-y-auto border-r p-6 pt-36 shadow-light-300 dark:shadow-none max-xl:hidden">
      <div className="flex flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Top Questions</h3>
        <div className="flex flex-col gap-6">
          {hotNetworks.map((item) => (
            <Link
              href="/"
              className="flex items-center justify-between gap-7"
              key={item.title}>
              <span className="body-medium text-dark500_light700">
                {item.title}
              </span>
              <Image
                src="/assets/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16 flex flex-col gap-6">
        <h3 className="h3-bold text-dark200_light900">Popular Tags</h3>
        <div className="flex flex-col gap-6">
          {popularTags.map((item) => (
            <RenderTag
              _id={item.label}
              key={item.label}
              name={item.label}
              totalQuestions={item.total_tag}
              showCount
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RightSidebar;
