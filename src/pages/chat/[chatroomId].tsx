import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Divider from "@/components/ui/Divider";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const ChatRoomPage = () => {
  const router = useRouter();
  const { chatroomId, sellerId } = router.query;
  const { data: session, status } = useSession();
  const numericSellerId = sellerId ? Number(sellerId) : null;

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const { data: messages, refetch } = trpc.main.getMessages.useQuery(
    { chatRoomId: Number(chatroomId) },
    {
      refetchInterval: 1000 * 10 * 2,
      refetchOnWindowFocus: false,
    }
  );

  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getSellerById.useQuery(
    { userId: numericSellerId! },
    { enabled: !!numericSellerId }
  );
  console.log("seller", seller);
  const sendMessage = trpc.main.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
    },
  });

  useEffect(() => {
    if (!chatroomId) return;

    const channel = supabase
      .channel(`room:${chatroomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "Message",
          filter: `chatRoomId=eq.${chatroomId}`,
        },
        () => {
          refetch(); // Refetch messages when a new message is inserted
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [chatroomId, refetch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    await sendMessage.mutateAsync({
      chatRoomId: Number(chatroomId),
      content: message,
      senderType: "BUYER", // Replace with actual user type
      senderId: userId && userId, // Replace with actual user ID
    });
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div onClick={() => router.back()} className=" m-5">
        <FaArrowLeftLong />
      </div>
      <div className=" text-center my-5">
        {seller && (
          <div className=" flex gap-3">
            <Image
              src={seller?.profileImage[0]}
              alt={seller?.firstName}
              width={40}
              height={40}
              className=" rounded-full"
            />
            <h1 className=" mt-3">
              {seller.firstName}
              {seller.lastName}
            </h1>
          </div>
        )}
      </div>
      {/* <Divider /> */}
      <div className="flex-1 overflow-y-auto py-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderType === "BUYER" && msg.senderId === 1
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <div
              className={`rounded-lg px-4 py-2 ${
                msg.senderType === "BUYER" && msg.senderId === 1
                  ? "bg-primary text-white"
                  : "bg-cardbg text-white"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <div className="">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 rounded-lg border py-2 text-black"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
