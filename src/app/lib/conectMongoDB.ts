import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_QUESTIONS_URL || ""; // 環境変数から接続URIを取得

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env"
  );
}

// MongoDBへの接続を確立するためのPromiseを定義
let isConnected: boolean = false; // 接続状況を管理

const connectToDatabase = async () => {
  // すでに接続されているかチェック
  if (isConnected) {
    return; // 既存の接続があれば再利用
  }

  // MongoDBに接続
  await mongoose
    .connect(MONGODB_URI)
    .then(() => console.log("Successfully connected to mongoDB!"));
  isConnected = true;
};

export default connectToDatabase;
