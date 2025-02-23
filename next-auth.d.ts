// next-auth.d.ts
import "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    phone: string;
    role: string; // Add the role field
  }

  interface Session {
    user: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: string; // Add the role field
  }
}
