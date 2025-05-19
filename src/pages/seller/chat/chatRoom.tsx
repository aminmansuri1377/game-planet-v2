import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
// import { createClient } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";
import { FaArrowLeftLong, FaPaperPlane } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { ImageUploadButton } from "@/components/Chat/ImageUploadButton";
import { MessageBubble } from "@/components/Chat/MessageBubble";
import { createSupabaseClient } from "../../../../supabase/client";

const ChatRoomPage = () => {
  const router = useRouter();
  const { chatroomId, buyerId } = router.query;
  const { data: session } = useSession();
  const numericBuyerId = buyerId ? Number(buyerId) : null;
  // const getSupabaseClient = () => {
  //   return createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //   );
  // };

  // Then use it inside your component
  const supabase = createSupabaseClient();
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const { data: messages, refetch } = trpc.main.getMessages.useQuery(
    { chatRoomId: Number(chatroomId) },
    {
      refetchInterval: 1000 * 10 * 2,
      refetchOnWindowFocus: false,
    }
  );

  const { data: buyer } = trpc.main.getBuyerById.useQuery(
    { userId: numericBuyerId! },
    { enabled: !!numericBuyerId }
  );

  const sendMessage = trpc.main.sendMessage.useMutation({
    onSuccess: () => {
      refetch();
      setImageFile(null);
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
          refetch();
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

  const uploadImage = async () => {
    if (!imageFile || !chatroomId || !userId) return null;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${userId}-${Date.now()}.${fileExt}`;
      const filePath = `chat-images/${chatroomId}/${fileName}`;

      const { error } = await supabase.storage
        .from("chat-images")
        .upload(filePath, imageFile);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-images").getPublicUrl(filePath);

      return publicUrl;
    } catch (error) {
      console.error("Error uploading image:", error);
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() && !imageFile) return;

    let imageUrl = null;
    if (imageFile) {
      imageUrl = await uploadImage();
      if (!imageUrl) return;
    }

    await sendMessage.mutateAsync({
      chatRoomId: Number(chatroomId),
      content: message || (imageFile ? "Sent an image" : ""),
      senderType: "SELLER",
      senderId: userId!,
      imageUrl: imageUrl || undefined,
    });
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div onClick={() => router.back()} className="m-5">
        <FaArrowLeftLong />
      </div>
      <div className="text-center">
        {buyer && (
          <div className="flex gap-3 justify-center items-center">
            {buyer?.profileImage && (
              <Image
                src={buyer?.profileImage[0] || "/default-profile.png"}
                alt={buyer?.firstName || "Buyer"}
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
            <h1 className="text-lg font-medium">
              {buyer.firstName} {buyer.lastName}
            </h1>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-4 px-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderType === "SELLER" && msg.senderId === userId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <MessageBubble
              content={msg.content}
              imageUrl={msg.imageUrl || undefined}
              isCurrentUser={
                msg.senderType === "SELLER" && msg.senderId === userId
              }
            />
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        {imageFile && (
          <div className="mb-2 relative">
            <Image
              src={URL.createObjectURL(imageFile)}
              alt="Preview"
              width={100}
              height={100}
              className="rounded-lg"
            />
            <button
              onClick={() => setImageFile(null)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <ImageUploadButton
            onFileSelect={setImageFile}
            disabled={isUploading}
          />
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            className="flex-1 rounded-lg border py-2 px-4 text-black"
            placeholder="Type a message..."
            disabled={isUploading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isUploading || (!message.trim() && !imageFile)}
            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-400"
          >
            <FaPaperPlane />
          </button>
        </div>
      </div>
    </div>
  );
};
//export const dynamic = "force-dynamic";

export default ChatRoomPage;
