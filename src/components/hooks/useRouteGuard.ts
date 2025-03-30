// hooks/useRouteGuard.ts
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

export const useRouteGuard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    const path = router.pathname;
    const role = session?.user?.role;

    if (!session) {
      // Redirect unauthenticated users to sign in
      if (path !== "/") {
        router.push("/");
      }
      return;
    }

    // Check access based on role
    if (role === "seller" && !path.startsWith("/seller")) {
      router.push("/seller");
    } else if (role === "manager" && !path.startsWith("/dashboard")) {
      router.push("/dashboard");
    } else if (
      role === "buyer" &&
      (path.startsWith("/seller") || path.startsWith("/dashboard"))
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  return { session, status };
};
