import { Schema, models, model, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IInteraction extends Document {
  user: Schema.Types.ObjectId; // refernce to user
  action: string;
  question: Schema.Types.ObjectId; // reference to question
  answer: Schema.Types.ObjectId; // reference to answer
  tags: Schema.Types.ObjectId[]; // reference to tag
  created_at: Date;
}

// 2. Create a Schema corresponding to the document interface.
const InteractionSchema = new Schema<IInteraction>({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  action: { type: String, required: true },
  question: { type: Schema.Types.ObjectId, ref: "Question" },
  answer: { type: Schema.Types.ObjectId, ref: "Answer" },
  tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
  created_at: { type: Date, default: Date.now() },
});

// 3. Create a Model.
const Interaction =
  models.Interaction || model<IInteraction>("Interaction", InteractionSchema);

export default Interaction;
