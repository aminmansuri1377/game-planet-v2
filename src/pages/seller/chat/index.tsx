import { useState } from "react";
// import { api } from "~/utils/api";
import { trpc } from "../../../../utils/trpc";
import { ChatComponent } from "@/components/Chat/ChatComponent";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
export default function ChatHistory() {
  const router = useRouter();

  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);
  const { data: session, status } = useSession();
  console.log("firstsession", session);
  // Replace these with your actual user info from your auth system
  const currentUserType = "SELLER"; // or "SELLER" or "MANAGER"
  const currentUserId = session?.user?.id && parseInt(session.user.id, 10);
  console.log("currentUserId", currentUserId);
  const { data: chatRooms } = trpc.main.getChatRooms.useQuery({
    userType: currentUserType,
    userId: currentUserId && currentUserId,
  });

  const getOtherParticipant = (room: any) => {
    if (currentUserType === "SELLER") {
      return room.seller || room.manager;
    } else if (currentUserType === "SELLER") {
      return room.buyer || room.manager;
    } else {
      return room.buyer || room.seller;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat rooms sidebar */}
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <div className="w-1/4 border-r bg-gray-50">
        <div className="p-4">
          <h2 className="mb-4 text-xl font-bold">Chats</h2>
          <div className="space-y-2">
            {chatRooms?.map((room) => {
              const otherParticipant = getOtherParticipant(room);
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoom(room.id)}
                  className={`cursor-pointer rounded-lg p-3 transition-colors ${
                    selectedRoom === room.id
                      ? "bg-blue-500"
                      : "hover:bg-gray-500"
                  }`}
                >
                  <div className="font-semibold">
                    {otherParticipant?.firstName || otherParticipant?.phone}
                  </div>
                  <div className="text-sm text-gray-800">
                    {room.messages[0]?.content}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1">
        {selectedRoom ? (
          <ChatComponent
            chatRoomId={selectedRoom}
            currentUserType={currentUserType}
            currentUserId={currentUserId && currentUserId}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
}
