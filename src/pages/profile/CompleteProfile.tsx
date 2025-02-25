import React from "react";
import CompleteProfile from "@/components/form/CompleteProfile";
import { useSession } from "next-auth/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";

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
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <CompleteProfile userId={userId} userType="buyer" />
    </div>
  );
}

export default Index;
