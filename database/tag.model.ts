import { Schema, models, model, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface ITag extends Document {
  name: string;
  description: string;
  questions: Schema.Types.ObjectId[];
  followers: Schema.Types.ObjectId[];
  createdOn: Date;
}

// 2. Create a Schema corresponding to the document interface.
const TagSchema = new Schema<ITag>({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  questions: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question", // Replace 'Question' with the actual name of the referenced model for questions
    },
  ],
  createdOn: {
    type: Date,
    default: Date.now,
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "User", // Replace 'User' with the actual name of the referenced model for users
    },
  ],
});

// 3. Create a Model.
const Tag = models.Tag || model<ITag>("Tag", TagSchema);

export default Tag;
