// components/auth/WithRole.tsx
"use client"; // Add this at the top (critical for Next.js 13+)

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import Loading from "../ui/Loading";

interface WithRoleProps {
  children: ReactNode;
  allowedRoles: ("buyer" | "seller" | "manager")[];
}

export const WithRole = ({ children, allowedRoles }: WithRoleProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Block rendering until session is loaded
  if (status === "loading") {
    return (
      <div className="min-h-screen mt-20 font-PeydaBold">
        <Loading />
      </div>
    );
  }

  // Redirect logic (handled client-side)
  if (!session || !allowedRoles.includes(session.user?.role as any)) {
    useEffect(() => {
      if (!session) {
        router.push("/");
      } else if (session.user?.role === "seller") {
        router.push("/seller");
      } else if (session.user?.role === "manager") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }, [session, router]);
    return null;
  }

  return <>{children}</>;
};
