// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Skip middleware for API/auth routes
    if (pathname.startsWith("/api") || pathname.startsWith("/_next")) {
      return NextResponse.next();
    }

    // Redirect logic based on role
    if (token) {
      if (token.role === "seller" && !pathname.startsWith("/seller")) {
        return NextResponse.redirect(new URL("/seller", req.url));
      }

      if (token.role === "manager" && !pathname.startsWith("/dashboard")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }

      if (
        token.role === "buyer" &&
        (pathname.startsWith("/seller") || pathname.startsWith("/dashboard"))
      ) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }
    if (!token) {
      return NextResponse.redirect(new URL("/signIn", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow public routes
        const publicPaths = ["/signIn", "/api/auth"];
        if (publicPaths.some((path) => req.nextUrl.pathname.startsWith(path))) {
          return true;
        }
        return !!token;
      },
    },
    pages: {
      signIn: "/signIn",
      error: "/error",
    },
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*", // Protect all dashboard routes
    "/seller/:path*", // Protect all seller routes
    "/", // Homepage (if protected)
  ],
};
