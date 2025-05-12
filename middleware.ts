// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Redirect logic based on role and path
    if (token?.role === "seller" && !pathname.startsWith("/seller")) {
      return NextResponse.redirect(new URL("/seller", req.url));
    }

    if (token?.role === "manager" && !pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    if (token?.role === "buyer" && pathname.startsWith("/seller")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    if (token?.role === "buyer" && pathname.startsWith("/dashboard")) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: [
    "/seller/:path*",
    "/dashboard/:path*",
    "/", // Add other protected paths as needed
  ],
};
