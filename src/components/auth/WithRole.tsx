// components/auth/WithRole.tsx
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";

interface WithRoleProps {
  children: ReactNode;
  allowedRoles: ("buyer" | "seller" | "manager")[];
}

export const WithRole = ({ children, allowedRoles }: WithRoleProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/");
      return;
    }

    if (!allowedRoles.includes(session.user?.role as any)) {
      // Redirect to default page based on role
      if (session.user?.role === "seller") {
        router.push("/seller");
      } else if (session.user?.role === "manager") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    }
  }, [status, session, allowedRoles, router]);

  if (
    status === "loading" ||
    !session ||
    !allowedRoles.includes(session.user?.role as any)
  ) {
    return (
      <div className=" min-h-screen mt-10">بارگذاری وشناسایی کاربر...</div>
    );
  }

  return <>{children}</>;
};
