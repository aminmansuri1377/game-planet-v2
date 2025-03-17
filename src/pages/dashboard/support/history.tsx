import { trpc } from "../../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";

const ManagerSupportHistoryPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { data: tickets, isLoading } = trpc.main.getTicketsByManagerId.useQuery(
    { managerId: session?.user?.id ? parseInt(session.user.id, 10) : 0 },
    { enabled: !!session?.user?.id }
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1 className="text-2xl font-bold mb-6">Support History</h1>
      <div className="space-y-4">
        {tickets?.map((ticket) => (
          <div key={ticket.id} className="p-4 border rounded-lg shadow-sm">
            <p className="font-semibold">
              Chat Room ID: {ticket.chatRoomSupportId} - Status: {ticket.status}
            </p>
            <p>
              User:{" "}
              {ticket.buyer
                ? `Buyer - ${ticket.buyer.firstName} ${ticket.buyer.lastName}`
                : `Seller - ${ticket.seller?.firstName} ${ticket.seller?.lastName}`}
            </p>
            <button
              onClick={() =>
                router.push(`/dashboard/support/${ticket.chatRoomSupportId}`)
              }
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              {ticket.status === "CLOSED" ? "View Chat" : "Continue Chat"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManagerSupportHistoryPage;
