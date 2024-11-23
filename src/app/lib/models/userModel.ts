import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema(
  {
    email: String,
    image: String,
    nickname: String,
    answerCnt: Number,
    correctCnt: Number,
    createCnt: Number,
    solvedCnt: Number,
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
