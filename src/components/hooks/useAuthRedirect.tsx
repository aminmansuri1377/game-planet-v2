// src/components/hooks/useAuthRedirect.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const useAuthRedirect = (allowedRoles?: string[]) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (allowedRoles && !allowedRoles.includes(session?.user?.role))
    ) {
      console.log("Redirecting to /signIn");
      router.push("/");
    }
  }, [session, status, router, allowedRoles]);

  return {
    isAuthenticated: status === "authenticated",
    isMounted,
  };
};
