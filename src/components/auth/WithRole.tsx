import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

interface WithRoleProps {
  children: ReactNode;
  allowedRoles: ("buyer" | "seller" | "manager")[];
}

export const WithRole = ({ children, allowedRoles }: WithRoleProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!allowedRoles.includes(session.user?.role as any)) {
      if (session.user?.role === "seller") {
        router.push("/seller");
      } else if (session.user?.role === "manager") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, allowedRoles, router, isClient]);

  if (!isClient || status === "loading") {
    return (
      <div className="min-h-screen mt-20 font-PeydaBold">
        بارگذاری و شناسایی کاربر...
      </div>
    );
  }

  if (!session || !allowedRoles.includes(session.user?.role as any)) {
    return null; // Redirect will happen in useEffect
  }

  return <>{children}</>;
};
