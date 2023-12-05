import Question from "@/components/forms/Question";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Ask Question | Dev Overflow",
  description: "Dev Overflow is a community of 1,000,000+ developers. Join us.",
};

const Page = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");

  const mongoUser = await getUserById({ userId });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Ask a Question</h1>
      <div className="mt-9">
        <Question mongoUserId={JSON.stringify(mongoUser?._id)} type="add" />
      </div>
    </div>
  );
};

export default Page;
