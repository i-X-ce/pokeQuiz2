import mongoose, { Schema } from "mongoose";

export const quizSchema = new Schema({
  question: String,
  choices: [String],
  correctAnswer: Number,
  imageUrl: String,
  answerCnt: Number,
  correctCnt: Number,
  description: String,
  userName: String,
  title: String,
});

const Question =
  mongoose.models.Question || mongoose.model("Question", quizSchema); // 'Question'という名前でコレクションが作成される(既に存在している場合は上書きせず)
export default Question;
