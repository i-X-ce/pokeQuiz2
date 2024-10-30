import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  await connectToDatabase();
  const email = req.nextUrl.searchParams.get("email");
  console.log();

  if (!email) {
    return NextResponse.json(
      { error: "No query parameters provided" },
      { status: 400 }
    );
  }

  if (!email || Array.isArray(email)) {
    return NextResponse.json(
      { error: "Invalid email parameter" },
      { status: 404 }
    );
  }

  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  return NextResponse.json(user, { status: 200 });
}
