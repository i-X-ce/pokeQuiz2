import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();
  const { email, nickname } = await req.json();
  console.log(req.body);
  console.log(email, nickname);

  await User.findOneAndUpdate({ email }, { nickname: nickname });
  return NextResponse.json({ message: "ユーザーが更新されました" });
}
