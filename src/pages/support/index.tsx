import { useSession } from "next-auth/react";
import React from "react";
import CustomButton from "@/components/ui/CustomButton";
import { trpc } from "../../../utils/trpc";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { BiSupport } from "react-icons/bi";

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
      router.push(
        `/support/chatRoom?chatRoomId=${newTicket.chatRoomSupportId}`
      );
    }
  };

  const handleSupportHistory = () => {
    router.push("/support/history");
  };
  if (!session) {
    return (
      <div className=" min-h-screen font-PeydaBold my-20">
        <div onClick={handleBack} className=" m-5">
          <FaArrowLeftLong />
        </div>
        <div>لطفا وارد شوید</div>
      </div>
    );
  }
  return (
    <div className=" min-h-screen">
      <HeadOfPages
        title="پشتیبانی"
        back={
          <div onClick={handleBack} className=" m-5">
            <FaArrowLeftLong />
          </div>
        }
        icon={
          <div className="w-14 text-center mx-auto">
            <RoundButton
              Children={
                <div>
                  <BiSupport size={40} className="text-center" />
                </div>
              }
            />
          </div>
        }
      />

      <div className=" text-center my-8">
        <CustomButton
          title="ایجاد چت پشتیبانی جدید"
          type="primary-btn"
          onClick={handleCreateTicket}
        />
        <CustomButton
          title="تاریخچه چت پشتیانی"
          type="primary-btn"
          onClick={handleSupportHistory}
        />
      </div>
    </div>
  );
}

export default index;
