import CustomButton from "@/components/ui/CustomButton";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import Loading from "@/components/ui/Loading";

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

  if (isLoading)
    return (
      <div>
        <Loading />
      </div>
    );
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
        title="تاریخچه چت پشتیانی"
        back={
          <div onClick={handleBack} className=" m-5">
            <FaArrowLeftLong />
          </div>
        }
        icon=""
      />
      {tickets?.map((ticket) => (
        <div
          key={ticket.id}
          className=" text-center bg-cardbg p-3 m-2 rounded-3xl"
        >
          <p>چت پشتیانی: {ticket.chatRoomSupportId}</p>
          <p>وضعیت: {ticket.status}</p>
          <CustomButton
            onClick={() =>
              router.push(
                `/support/chatRoom?chatRoomId=${ticket.chatRoomSupportId}`
              )
            }
            disabled={ticket.status === "بسته شده"}
            title={ticket.status === "CLOSED" ? "نمایش چت" : "ادامه چت"}
            type="secondary-btn"
          />
        </div>
      ))}
    </div>
  );
};
//export const dynamic = "force-dynamic";

export default SupportHistoryPage;
