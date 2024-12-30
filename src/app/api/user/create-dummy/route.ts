import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const L = 100; // 作成するダミーデータの数

export async function POST() {
  const session = await getServerSession();
  if (session?.user?.email != process.env.MY_EMAIL) {
    return NextResponse.json({ message: "権限がありません" }, { status: 401 });
  }

  await connectToDatabase();

  for (let i = 0; i < L; i++) {
    User.create({
      email: `thisisdummyemail${i}@gmail.com`,
      image:
        "https://lh3.googleusercontent.com/a/ACg8ocI6xPMcei_5oi64mw5WuuBOdOse-zzxE7cT0x6l2mzp8cyudGE=s96-c",
      nickname: `ダミー${i}`,
      answerCnt: L,
      correctCnt: i,
    });
  }
  return NextResponse.json({ messagge: "ダミーユーザーを作成しました" });
}
