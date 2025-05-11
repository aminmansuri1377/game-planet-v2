import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "../../../lib/db";

export const authOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signIn",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: { label: "Phone", type: "text", placeholder: "0912000" },
      },
      async authorize(credentials, req) {
        if (!credentials?.phone) {
          return null;
        }
        const path = req.headers?.referer?.split("?")[0]; // Get the URL path
        let model;
        let role;

        // Map the path to the corresponding Prisma model and role
        if (path?.includes("/seller")) {
          model = "seller";
          role = "seller";
        } else if (path?.includes("/dashboard")) {
          model = "manager";
          role = "manager";
        } else {
          model = "buyer"; // Default model
          role = "buyer";
        }

        const existingUser = await db[model].findUnique({
          where: { phone: credentials.phone },
        });

        if (!existingUser) {
          return null;
        }

        return {
          phone: existingUser.phone,
          id: existingUser.id,
          role, // Add role to the user object
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        return {
          ...token,
          id: user.id,
          phone: user.phone,
          role: user.role, // Include role in JWT
        };
      }
      return token;
    },
    async session({ session, token }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          phone: token.phone,
          role: token.role, // Include role in session
        },
      };
    },
  },
};

export default NextAuth(authOptions);
// export const config = {
//   api: {
//     bodyParser: false, // Disables body parsing for better static optimization
//     externalResolver: true, // Tells Vercel this is an external resolver
//   },
// };
