import connectToDatabase from "@/app/lib/conectMongoDB";
import Question from "@/app/lib/models/quizModel";

export async function DELETE() {
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
