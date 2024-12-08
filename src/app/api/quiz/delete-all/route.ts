import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE() {
  const session = await getServerSession();
  if (session?.user?.email != process.env.MY_EMAIL)
    return NextResponse.json({ message: "権限がありません" }, { status: 401 });

  try {
    await connectToDatabase();
    await Question.deleteMany({});
    return Response.json({ messaga: "すべてのデータを削除しました" });
  } catch (error) {
    return Response.json(
      { error: "データの削除に失敗しました" },
      { status: 500 }
    );
  }
}
