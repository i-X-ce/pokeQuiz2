import type { NextAuthOptions } from "next-auth";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import connectToDatabase from "./conectMongoDB";
import User from "./models/userModel";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  callbacks: {
    // eslint-disable-next-line
    async signIn({ user }: { user: any }) {
      await connectToDatabase();
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        await User.create({
          nickname: user.name.slice(0, 5),
          email: user.email,
          image: user.image,
        });
      } else {
        await User.updateOne({ email: user.email }, { image: user.image });
        user.isFirstLogin = false;
      }
      return true;
    },
  },
  session: {
    strategy: "jwt" as const,
  },
} satisfies NextAuthOptions;

export const { handler, auth, signIn, signOut } = NextAuth(authOptions);
