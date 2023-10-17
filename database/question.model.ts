import { Schema, models, model, Document, Types } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IQuestion extends Document {
  title: string;
  content: string;
  upvotes: Types.ObjectId[];
  downvotes: Types.ObjectId[];
  author: Types.ObjectId;
  answers: Types.ObjectId[];
  tags: Types.ObjectId[];
  views: number;
  createdAt: Date;
}

// 2. Create a Schema corresponding to the document interface.
const QuestionSchema = new Schema<IQuestion>({
  title: { type: String, required: true },
  content: { type: String, required: true },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tags", required: true }],
  views: { type: Number, default: 0 },
  upvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  downvotes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  author: { type: Schema.Types.ObjectId, ref: "User" },
  answers: [{ type: Schema.Types.ObjectId, ref: "Answer" }],
  createdAt: { type: Date, default: Date.now },
});

// 3. Create a Model.
const Question =
  models.Question || model<IQuestion>("Question", QuestionSchema);

export default Question;
