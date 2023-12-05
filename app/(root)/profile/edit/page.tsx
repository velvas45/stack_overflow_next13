import Profile from "@/components/forms/Profile";
import { getUserInfo } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Edit Profile | Dev Overflow",
  description: "Dev Overflow is a community of 1,000,000+ developers. Join us.",
};

const Page = async () => {
  const { userId } = auth();

  if (!userId) redirect("/sign-in");
  const userInfo = await getUserInfo({ userId });
  return (
    <div>
      <h1 className="h1-bold text-dark100_light900">Edit Profile</h1>
      <Profile clerkId={userId} userDetail={JSON.stringify(userInfo)} />
    </div>
  );
};

export default Page;
