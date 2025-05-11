import CustomButton from "../../components/ui/CustomButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthRedirect } from "../../components/hooks/useAuthRedirect";
import Cookies from "js-cookie";
import { HiOutlineSquaresPlus } from "react-icons/hi2";
import { trpc } from "../../../utils/trpc";
import { signOut, useSession } from "next-auth/react";
import HeadOfPages from "@/components/ui/HeadOfPages";
import { BiSupport } from "react-icons/bi";
import RoundButton from "@/components/ui/RoundButton";
import { MdOutlineManageAccounts } from "react-icons/md";
import { CiLogout } from "react-icons/ci";
// import { WithRole } from "@/components/auth/WithRole";

function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: session } = useSession();

  const currentUserId = session?.user?.id
    ? parseInt(session.user.id, 10)
    : null;
  const handleLogout = async () => {
    await signOut({ redirect: false });
    Cookies.remove("dashboardAuth");
    router.push("/");
  };
  const { data: unassignedTickets, refetch } =
    trpc.main.getUnassignedTickets.useQuery();
  const assignTicket = trpc.main.assignTicketToManager.useMutation({
    onSuccess: () => {
      refetch();
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
    // <WithRole allowedRoles={["manager"]}>
    <div className=" text-center mx-auto min-h-screen">
      <HeadOfPages
        title="ادمین"
        back={
          <div className=" m-5" onClick={handleLogout}>
            <CiLogout size={40} className="text-center " />
          </div>
        }
        icon={
          <div className="w-14 text-center mx-auto">
            <RoundButton
              Children={
                <div>
                  <MdOutlineManageAccounts size={40} className="text-center" />
                </div>
              }
            />
          </div>
        }
      />
      <div className=" mt-12">
        <CustomButton
          title="ایجاد"
          type="primary-btn"
          onClick={() => router.push("/dashboard/create")}
        />
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
          title="اجاره کنندگان"
          type="primary-btn"
          onClick={() => router.push("/dashboard/buyers")}
        />
        <CustomButton
          title="اجاره دهندگان"
          type="primary-btn"
          onClick={() => router.push("/dashboard/sellers")}
        />
      </div>
      <div className=" m-8">
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
              قبول پشتیبانی
            </button>
          </div>
        ))}
      </div>
      <CustomButton
        title="تاریخچه چت"
        type="primary-btn"
        onClick={() => router.push("/dashboard/support/history")}
      />
    </div>
    // </WithRole>
  );
}

export default Index;
