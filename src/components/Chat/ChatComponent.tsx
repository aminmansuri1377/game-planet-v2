import { useState, useEffect, useRef } from "react";
import { trpc } from "../../../utils/trpc";
// import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/router";
import { FaPaperPlane } from "react-icons/fa6";
import { ImageUploadButton } from "@/components/Chat/ImageUploadButton";
import { MessageBubble } from "@/components/Chat/MessageBubble";
import Image from "next/image";
import { createSupabaseClient } from "../../../supabase/client";

interface ChatComponentProps {
  chatRoomId: number;
  currentUserType: "BUYER" | "SELLER" | "MANAGER";
  currentUserId: number;
}

export const ChatComponent = ({
  chatRoomId,
  currentUserType,
  currentUserId,
}: ChatComponentProps) => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // const getSupabaseClient = () => {
  //   return createClient(
  //     process.env.NEXT_PUBLIC_SUPABASE_URL!,
  //     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  //   );
  // };

  // Then use it inside your component
  const supabase = createSupabaseClient();
  const { data: messages, refetch } = trpc.main.getSupportMessages.useQuery(
    { chatRoomId },
    {
      refetchInterval: 1000 * 10 * 2,
      refetchOnWindowFocus: false,
    }
  );

  const sendMessage = trpc.main.sendSupportMessage.useMutation({
    onSuccess: () => {
      refetch();
      setImageFile(null);
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
          refetch();
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [chatRoomId, refetch]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const uploadImage = async () => {
    if (!imageFile || !chatRoomId || !currentUserId) return null;

    setIsUploading(true);
    try {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${currentUserId}-${Date.now()}.${fileExt}`;
      const filePath = `support-images/${chatRoomId}/${fileName}`;

      const { error } = await supabase.storage
        .from("support-images")
        .upload(filePath, imageFile);

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("support-images").getPublicUrl(filePath);

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
      chatRoomId,
      content: message || (imageFile ? "Sent an image" : ""),
      senderType: currentUserType,
      senderId: currentUserId,
      imageUrl: imageUrl || undefined,
    });
    setMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto py-4 px-4">
        {messages?.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.senderType === currentUserType &&
              msg.senderId === currentUserId
                ? "justify-end"
                : "justify-start"
            }`}
          >
            <MessageBubble
              content={msg.content}
              imageUrl={msg.imageUrl || undefined}
              isCurrentUser={
                msg.senderType === currentUserType &&
                msg.senderId === currentUserId
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
