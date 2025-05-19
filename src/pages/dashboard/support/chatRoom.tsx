import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChatComponent } from "@/components/Chat/ChatComponent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { WithRole } from "@/components/auth/WithRole";

const ManagerSupportChatRoom = () => {
  const router = useRouter();
  const { chatRoomId } = router.query;
  const handleBack = () => {
    router.back();
  };
  const { data: session } = useSession();
  console.log("chatRoomId", chatRoomId);
  const { data: ticket, isLoading } = trpc.main.getTicketByChatRoomId.useQuery(
    { chatRoomId: parseInt(chatRoomId as string, 10) },
    { enabled: !!chatRoomId }
  );

  if (isLoading) return <div>Loading...</div>;
  if (!ticket) return <div>Ticket not found.</div>;

  const user = ticket.buyer || ticket.seller;
  const userType = ticket.buyer ? "Buyer" : "Seller";

  return (
    <WithRole allowedRoles={["manager"]}>
      <div className="p-6">
        <div onClick={handleBack}>
          <FaArrowLeftLong />
        </div>
        <h1 className="text-2xl font-bold mb-6">
          Support Chat Room #{ticket.chatRoomSupportId}
        </h1>
        <p className="mb-4">
          Chatting with {userType}: {user?.firstName} {user?.lastName}
        </p>
        <ChatComponent
          chatRoomId={ticket.id}
          currentUserType="MANAGER"
          currentUserId={session?.user?.id ? parseInt(session.user.id, 10) : 0}
        />
      </div>
    </WithRole>
  );
};
//export const dynamic = "force-dynamic";

export default ManagerSupportChatRoom;
