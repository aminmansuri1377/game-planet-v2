import { useState } from "react";
import { trpc } from "../../../../utils/trpc";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { GoMail } from "react-icons/go";
import Image from "next/image";
import Divider from "@/components/ui/Divider";
import { WithRole } from "@/components/auth/WithRole";

export default function ChatHistory() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const router = useRouter();
  const { data: session, status } = useSession();
  const currentUserType = "SELLER"; // or "SELLER" or "MANAGER"
  const currentUserId = session?.user?.id
    ? parseInt(session.user.id, 10)
    : null;

  const { data: chatRooms } = trpc.main.getChatRooms.useQuery({
    userType: currentUserType,
    userId: currentUserId && currentUserId,
  });

  const getOtherParticipant = (room: any) => {
    if (currentUserType === "BUYER") {
      return room.seller || room.manager;
    } else if (currentUserType === "SELLER") {
      return room.buyer || room.manager;
    } else {
      return room.buyer || room.seller;
    }
  };

  const handleRoomClick = (roomId: number, buyerId: number) => {
    router.push(`/seller/chat/${roomId}?buyerId=${buyerId}`);
  };
  const handleSupportHistory = () => {
    router.push("/seller/support/history");
  };

  return (
    <WithRole allowedRoles={["seller"]}>
      <div className="h-screen bg-secondary">
        <HeadOfPages
          title="پیام ها و اعلانات"
          back={
            <div onClick={() => router.back()} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <GoMail size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        {/* Chat rooms sidebar */}
        <div className="border-r">
          <div className="p-4 text-end">
            <div className="space-y-2">
              <div
                className=" flex justify-end mx-2 my-6"
                onClick={handleSupportHistory}
              >
                <div className=" mx-5">
                  <div className="font-semibold font-PeydaBold">
                    چت های پشتیبانی
                  </div>
                  <div className="text-sm text-gray-800">رنــتـا</div>
                </div>
                {/* <Image
                src={otherParticipant?.profileImage[0]}
                alt={otherParticipant?.firstName}
                width={40}
                height={40}
                className=" rounded-full"
              /> */}
              </div>
              <Divider />
              {chatRooms?.map((room) => {
                const otherParticipant = getOtherParticipant(room);

                return (
                  <div
                    key={room.id}
                    onClick={() => handleRoomClick(room.id, room.buyerId)}
                    className={`cursor-pointer rounded-lg p-3 transition-colors ${
                      selectedRoom === room.id
                        ? "bg-blue-500"
                        : "hover:bg-gray-500"
                    }`}
                  >
                    <div className=" flex justify-end">
                      <div className=" mx-5">
                        <div className="font-semibold font-PeydaBold">
                          {otherParticipant?.firstName ||
                            otherParticipant?.phone}
                        </div>
                        <div className="text-sm text-gray-800">
                          {room.messages[0]?.content}
                        </div>
                      </div>
                      {otherParticipant?.profileImage && (
                        <Image
                          src={otherParticipant?.profileImage[0]}
                          alt={otherParticipant?.firstName}
                          width={40}
                          height={40}
                          className=" rounded-full"
                        />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Chat area */}
        <div className="flex-1">
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        </div>
      </div>
    </WithRole>
  );
}
