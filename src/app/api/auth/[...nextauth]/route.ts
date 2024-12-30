import connectToDatabase from "@/app/lib/conectMongoDB";
import User from "@/app/lib/models/userModel";
import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

const handler = NextAuth({
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
    strategy: "jwt",
  },
});

export { handler as GET, handler as POST, handler as authOptions };
