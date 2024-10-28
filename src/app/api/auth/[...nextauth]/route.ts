import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import mongoose from "mongoose";
import NextAuth, { SessionStrategy } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          nickname: user.name,
          email: user.email,
          image: user.image,
        });
        user.isFirstLogin = true;
      } else {
        user.isFirstLogin = false;
      }
      return true;
    },
  },
  async session({ session, token }) {
    session.user.isFirstLogin = token.isFirstLogin || false;
    return session;
  },
  // session: {
  //   strategy: "jwt" as SessionStrategy,
  // },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
