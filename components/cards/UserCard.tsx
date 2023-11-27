import Image from "next/image";
import Link from "next/link";
import React from "react";
import RenderTag from "../shared/RenderTag";
import { getTopInteractedTags } from "@/lib/actions/tag.action";

interface Props {
  user: {
    _id: string;
    clerkId: string;
    picture: string;
    name: string;
    username: string;
  };
}

const UserCard = async ({
  user: { _id, clerkId, picture, name, username },
}: Props) => {
  const interactedTags = await getTopInteractedTags({ userId: _id });
  //   const interactedTags: any[] = [];

  return (
    <Link
      href={`/profile/${clerkId}`}
      className="shadow-light100_darknone w-full max-xs:min-w-full xs:w-[260px]">
      <article className="background-light900_dark200 light-border flex w-full flex-col items-center justify-center rounded-2xl border p-8">
        <Image
          src={picture}
          alt={name}
          width={100}
          height={100}
          className="rounded-full"
        />

        <div className="mt-4 text-center">
          <h3 className="h3-bold text-dark200_light900 line-clamp-1">{name}</h3>
          <p className="body-regular text-dark500_light500 mt-2">@{username}</p>
        </div>
        <div className="mt-5">
          {Array.isArray(interactedTags) && interactedTags.length > 0 ? (
            <div className="flex items-center gap-2">
              {interactedTags.map((tag) => (
                <RenderTag key={tag._id} _id={tag._id} name={tag.name} />
              ))}
            </div>
          ) : (
            <div className="subtle-medium background-light800_dark300 text-light400_light500 inline-flex items-center rounded-md border border-none border-transparent bg-slate-900 px-4 py-2 text-xs font-semibold uppercase shadow transition-colors hover:bg-slate-900/80 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 dark:border-slate-800 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/80 dark:focus:ring-slate-300">
              no tags yet
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default UserCard;
