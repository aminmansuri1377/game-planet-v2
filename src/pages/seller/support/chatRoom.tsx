import { trpc } from "../../../../utils/trpc";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { ChatComponent } from "@/components/Chat/ChatComponent";
import { FaArrowLeftLong } from "react-icons/fa6";

const SupportChatRoom = () => {
  const router = useRouter();
  const { chatRoomId } = router.query;
  const handleBack = () => {
    router.back();
  };
  const { data: session } = useSession();

  const { data: ticket } = trpc.main.getTicketByChatRoomId.useQuery(
    { chatRoomId: parseInt(chatRoomId as string, 10) },
    { enabled: !!chatRoomId }
  );

  if (!ticket) return <div>Loading...</div>;

  const currentUserType = "SELLER";
  const currentUserId = session?.user?.id ? parseInt(session.user.id, 10) : 0;

  return (
    <div className=" min-h-screen">
      <div onClick={handleBack} className=" my-5">
        <FaArrowLeftLong />
      </div>
      <h1>Support Chat Room #{ticket.chatRoomSupportId}</h1>
      <ChatComponent
        chatRoomId={ticket.chatRoomSupportId}
        currentUserType={currentUserType}
        currentUserId={currentUserId}
      />
    </div>
  );
};
//export const dynamic = "force-dynamic";

export default SupportChatRoom;
