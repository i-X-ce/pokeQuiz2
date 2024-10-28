import NextAuth, { SessionStrategy } from "next-auth";
import Google from "next-auth/providers/google";

export const authOptions = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt" as SessionStrategy,
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };