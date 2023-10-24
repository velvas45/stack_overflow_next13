import { Schema, models, model, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IAnswer extends Document {
  content: string;
  question: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  upvotes: Schema.Types.ObjectId[];
  downvotes: Schema.Types.ObjectId[];
  createdAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const AnswerSchema = new Schema<IAnswer>({
  content: { type: String, required: true },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  createdAt: { type: Date, default: Date.now },
});

// 3. Create a Model.
const Answer = models.Answer || model<IAnswer>("Answer", AnswerSchema);

export default Answer;
