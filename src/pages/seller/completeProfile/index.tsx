import React from "react";
import CompleteProfile from "@/components/form/CompleteProfile";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { WithRole } from "@/components/auth/WithRole";

function Index() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  // Get userId from session and convert it to a number
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  // If userId is null or invalid, show an error or redirect
  if (userId === null || isNaN(userId)) {
    return <div>Error: Invalid user ID. Please log in again.</div>;
  }
  console.log("ttttttt", session);

  return (
    <WithRole allowedRoles={["seller"]}>
      <div>
        <div onClick={handleBack}>
          <FaArrowLeftLong />
        </div>
        <CompleteProfile userId={userId} userType="seller" />
      </div>
    </WithRole>
  );
}

export default Index;
