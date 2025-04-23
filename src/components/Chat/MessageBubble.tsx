// components/Chat/MessageBubble.tsx
import Image from "next/image";

interface MessageBubbleProps {
  content: string;
  imageUrl?: string;
  isCurrentUser: boolean;
}

export const MessageBubble = ({
  content,
  imageUrl,
  isCurrentUser,
}: MessageBubbleProps) => {
  return (
    <div
      className={`rounded-lg px-4 py-2 max-w-xs md:max-w-md ${
        isCurrentUser ? "bg-primary text-white" : "bg-cardbg text-white"
      }`}
    >
      {imageUrl ? (
        <div className="mt-2">
          <Image
            src={imageUrl}
            alt="Chat image"
            width={300}
            height={300}
            className="rounded-lg"
          />
        </div>
      ) : null}
      {content && <p className={imageUrl ? "mt-2" : ""}>{content}</p>}
    </div>
  );
};
