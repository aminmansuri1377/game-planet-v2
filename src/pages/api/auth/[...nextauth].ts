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

        // Map the path to the corresponding Prisma model
        if (path?.includes("/seller")) {
          model = "seller";
        } else if (path?.includes("/dashboard")) {
          model = "manager";
        } else {
          model = "buyer"; // Default model
        }
        const existingUser = await db[model].findUnique({
          where: { phone: credentials.phone },
        });
        if (!existingUser) {
          return null;
        }
        return {
          phone: existingUser.phone,
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
        },
      };
    },
  },
};

export default NextAuth(authOptions);

// export const authOptions = {
//   adapter: PrismaAdapter(db),
//   secret: process.env.NEXTAUTH_SECRET,
//   session: {
//     strategy: "jwt",
//     maxAge: 30 * 24 * 60 * 60,
//   },
//   pages: {
//     signIn: "/signIn",
//   },
//   providers: [
//     CredentialsProvider({
//       name: "Credentials",
//       credentials: {
//         phone: { label: "Phone", type: "text", placeholder: "0912000" },
//         role: { label: "Role", type: "text" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.phone || !credentials?.role) {
//           return null;
//         }

//         const { phone, role } = credentials;

//         if (role === "buyer") {
//           const buyer = await db.buyer.findUnique({ where: { phone } });
//           if (!buyer) return null;
//           return { id: buyer.id, phone: buyer.phone, role: "buyer" };
//         }

//         if (role === "seller") {
//           const seller = await db.seller.findUnique({ where: { phone } });
//           if (!seller) return null;
//           return { id: seller.id, phone: seller.phone, role: "seller" };
//         }

//         if (role === "manager") {
//           const manager = await db.manager.findUnique({ where: { phone } });
//           if (!manager) return null; // No manager found
//           return { id: manager.id, phone: manager.phone, role: "manager" };
//         }

//         return null;
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         return {
//           ...token,
//           id: user.id,
//           phone: user.phone,
//           role: user.role,
//         };
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       return {
//         ...session,
//         user: {
//           ...session.user,
//           id: token.id,
//           phone: token.phone,
//           role: token.role,
//         },
//       };
//     },
//   },
// };

// export default NextAuth(authOptions);
