import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";

const SupportHistoryPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { data: tickets, isLoading } = trpc.main.getAllTicketsByUserId.useQuery(
    {
      buyerId: session?.user?.id ? parseInt(session.user.id, 10) : undefined,
    },
    { enabled: !!session?.user?.id }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1>Support History</h1>
      {tickets?.map((ticket) => (
        <div key={ticket.id}>
          <p>Chat Room ID: {ticket.chatRoomSupportId}</p>
          <p>Status: {ticket.status}</p>
          <button
            onClick={() => router.push(`/support/${ticket.chatRoomSupportId}`)}
            disabled={ticket.status === "CLOSED"}
          >
            {ticket.status === "CLOSED" ? "View Chat" : "Continue Chat"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default SupportHistoryPage;
