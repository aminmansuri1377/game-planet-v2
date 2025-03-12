import { useState } from "react";
// import { api } from "~/utils/api";
import { trpc } from "../../../utils/trpc";
import { ChatComponent } from "@/components/Chat/ChatComponent";
export default function ChatHistory() {
  const [selectedRoom, setSelectedRoom] = useState<number | null>(null);

  // Replace these with your actual user info from your auth system
  const currentUserType = "BUYER"; // or "SELLER" or "MANAGER"
  const currentUserId = 1; // Get this from your auth system

  const { data: chatRooms } = trpc.main.getChatRooms.useQuery({
    userType: currentUserType,
    userId: currentUserId,
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

  return (
    <div className="flex h-screen">
      {/* Chat rooms sidebar */}
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
                      ? "bg-blue-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-semibold">
                    {otherParticipant?.firstName || otherParticipant?.phone}
                  </div>
                  <div className="text-sm text-gray-500">
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
            currentUserId={currentUserId}
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
