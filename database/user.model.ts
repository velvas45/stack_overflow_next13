import { Schema, models, model, Document } from "mongoose";

// 1. Create an interface representing a document in MongoDB.
export interface IUser extends Document {
  clerkId: string;
  name: string;
  username: string;
  email: string;
  picture: string;
  joinedAt: Date;
  reputation?: number;
  password?: string;
  location?: string;
  bio?: string;
  portfolioWebsite?: string;
  saved: Schema.Types.ObjectId[];
}

// 2. Create a Schema corresponding to the document interface.
const UserSchema = new Schema<IUser>({
  clerkId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: {
    type: String,
    required: true,
  },
  joinedAt: {
    type: Date,
    default: Date.now,
  },
  reputation: {
    type: Number,
    default: 0,
  },
  password: {
    type: String,
  },
  location: {
    type: String,
  },
  bio: {
    type: String,
  },
  portfolioWebsite: {
    type: String,
  },
  saved: [
    {
      type: Schema.Types.ObjectId,
      ref: "Question",
    },
  ],
});

// 3. Create a Model.
const User = models.User || model<IUser>("User", UserSchema);

export default User;
