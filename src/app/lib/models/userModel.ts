import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  email: String,
  image: String,
  nickname: String,
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
