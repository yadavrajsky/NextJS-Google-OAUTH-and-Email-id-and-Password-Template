import NextAuth, { type NextAuthOptions } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import connectToDB from "@/lib/db";
import UserModel from "@/app/models/userModel";

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  debug: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      id: "email",
      name: "email",
      type: "credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "bruce@wayne.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password }: { email: string; password: string } =
          credentials ?? { email: "", password: "" };

        if (!email || !password) {
          throw new Error("Please provide email and password.");
        }

        const db = await connectToDB();

        const user = await UserModel.findOne({ email }).select("+password");

        if (!user) {
          throw new Error("Please enter email and password.");
        }

        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
          throw new Error("Please enter email and password.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }: { token: any; session: any }) {
      const user = session.user;

      if (token && user) {
        user.id = token.id;
        user.name = token.name;
        user.email = token.email;
        user.isAdmin = token.isAdmin;
        user.firstName = token.firstName;
        user.lastName = token.lastName;

      }

      return session;
    },
    async jwt({ token, user }: { token: any; user: any }) {
      const dbUser = await UserModel.findOne({
        where: {
          email: token?.email,
        },
      });

      if (!dbUser) {
        token.id = user.id;
        return token;
      }

      return {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        isAdmin: dbUser.isAdmin,
      };
    },

  },
};

export const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
