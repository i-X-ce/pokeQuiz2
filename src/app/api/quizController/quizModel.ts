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

const Quiz = mongoose.model('Question', quizSchema); // 'Question'という名前でコレクションが作成される
export default Quiz;