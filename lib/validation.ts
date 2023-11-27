import * as z from "zod";

export const QuestionSchema = z.object({
  title: z.string().min(5).max(130),
  explanation: z.string().min(100),
  tags: z.array(z.string().min(1).max(15)).min(1).max(3),
});

export const AnswerSchema = z.object({
  answer: z.string().min(100),
});

export const ProfileSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters." })
    .max(50),
  username: z
    .string()
    .max(100, { message: "username musn't be longer then 100 characters." }),
  portfolioLink: z
    .string()
    .url({ message: "Please provide valid URL" })
    .nullish(),
  location: z.string().min(3).max(50).nullish(),
  bio: z.string().min(3, { message: "Bio must be at least 3 characters." }),
});
