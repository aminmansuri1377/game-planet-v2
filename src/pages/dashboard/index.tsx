import CustomButton from "../../components/ui/CustomButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthRedirect } from "../../components/hooks/useAuthRedirect";
import Cookies from "js-cookie";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";

function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  const currentUserId = session?.user?.id
    ? parseInt(session.user.id, 10)
    : null;
  const handleLogout = () => {
    Cookies.remove("dashboardAuth");
    router.push("/");
  };
  const { data: unassignedTickets, refetch } =
    trpc.main.getUnassignedTickets.useQuery();
  const assignTicket = trpc.main.assignTicketToManager.useMutation({
    onSuccess: () => {
      refetch(); // Refresh the list of unassigned tickets
    },
  });

  const handleAcceptTicket = async (
    ticketId: number,
    chatRoomSupportId: any
  ) => {
    if (session?.user?.id) {
      await assignTicket.mutateAsync({
        ticketId,
        managerId: currentUserId,
      });
      router.push(`/dashboard/support/${chatRoomSupportId}`); // Redirect to the chat room
    }
  };
  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className=" text-center mx-auto">
      {/* <CustomButton
        title={t("rent.productCreation")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/createProduct")}
      /> */}
      <CustomButton
        title={t("rent.products")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/products")}
      />
      <CustomButton
        title={t("rent.orders")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/orders")}
      />
      <CustomButton
        title="buyers"
        type="primary-btn"
        onClick={() => router.push("/dashboard/buyers")}
      />
      <CustomButton
        title="sellers"
        type="primary-btn"
        onClick={() => router.push("/dashboard/sellers")}
      />
      <div>
        <h1>Support Tickets</h1>
        {unassignedTickets?.map((ticket) => (
          <div key={ticket.id} className="p-4 border rounded-lg shadow-sm">
            <p className="font-semibold">
              Ticket ID: {ticket.id} - Status: {ticket.status}
            </p>
            <p>
              User:{" "}
              {ticket.buyer
                ? `Buyer - ${ticket.buyer.firstName} ${ticket.buyer.lastName}`
                : `Seller - ${ticket.seller?.firstName} ${ticket.seller?.lastName}`}
            </p>
            <button
              onClick={() =>
                handleAcceptTicket(ticket.id, ticket.chatRoomSupportId)
              }
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Accept Ticket
            </button>
          </div>
        ))}
      </div>
      <CustomButton
        title="Support History"
        type="primary-btn"
        onClick={() => router.push("/dashboard/support/history")}
      />
      <div className=" mt-20">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg font-PeydaBold"
          onClick={handleLogout}
        >
          {t("rent.logout")}
        </button>
      </div>
    </div>
  );
}

export default Index;
