import { useSession } from "next-auth/react";
import React from "react";
import CustomButton from "@/components/ui/CustomButton";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";

function index() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const currentUserType = "BUYER";
  const currentUserId = session?.user?.id
    ? parseInt(session.user.id, 10)
    : null;
  const createTicket = trpc.main.createTicket.useMutation();
  const { data: ticket, isLoading } = trpc.main.getTicketByUserId.useQuery(
    { buyerId: currentUserId },
    { enabled: !!session?.user?.id }
  );

  const handleCreateTicket = async () => {
    if (session?.user?.id) {
      const newTicket = await createTicket.mutateAsync({
        buyerId: currentUserId,
      });
      router.push(`/support/${newTicket.chatRoomSupportId}`);
    }
  };

  const handleSupportHistory = () => {
    router.push("/support/history");
  };

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <CustomButton
        title="Create Support Ticket"
        type="primary-btn"
        onClick={handleCreateTicket}
      />
      <CustomButton
        title="Support History Chat"
        type="primary-btn"
        onClick={handleSupportHistory}
      />
    </div>
  );
}

export default index;
