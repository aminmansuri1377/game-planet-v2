import { useState, useEffect, useRef } from "react";
// import { api } from "~/utils/api";
import { trpc } from "../../../utils/trpc";
import { createClient } from "@supabase/supabase-js";

interface ChatComponentProps {
  chatRoomId: number;
  currentUserType: "BUYER" | "SELLER" | "MANAGER";
  currentUserId: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const ChatComponent = ({
  chatRoomId,
  currentUserType,
  currentUserId,
}: ChatComponentProps) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const utils = trpc.main.useContext();

  const { data: messages } = trpc.main.getMessages.useQuery({ chatRoomId });
  const sendMessage = trpc.main.sendMessage.useMutation({
    onSuccess: () => {
      utils.chat.getMessages.invalidate({ chatRoomId });
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel(`room:${chatRoomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `chatRoomId=eq.${chatRoomId}`,
        },
        () => {
          void utils.chat.getMessages.invalidate({ chatRoomId });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [chatRoomId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage.mutateAsync({
      chatRoomId,
      content: message,
      senderType: currentUserType,
      senderId: currentUserId,
    });
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderId === currentUserId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                msg.senderId === currentUserId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 rounded-lg border px-4 py-2"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};
