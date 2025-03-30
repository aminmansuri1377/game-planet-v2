import HeadOfPages from "@/components/ui/HeadOfPages";
import { trpc } from "../../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { MdOutlinePersonAdd } from "react-icons/md";
import RoundButton from "@/components/ui/RoundButton";
import { WithRole } from "@/components/auth/WithRole";

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
    <WithRole allowedRoles={["manager"]}>
      <div className=" w-full min-h-screen">
        <HeadOfPages
          title="تاریخچه چت"
          back={
            <div onClick={handleBack} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton Children={<div></div>} />
            </div>
          }
        />
        <div className="space-y-4">
          {tickets?.map((ticket) => (
            <div key={ticket.id} className="p-4 border rounded-lg shadow-sm">
              <p className="font-semibold">
                Chat Room ID: {ticket.chatRoomSupportId} - Status:{" "}
                {ticket.status}
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
    </WithRole>
  );
};

export default ManagerSupportHistoryPage;
