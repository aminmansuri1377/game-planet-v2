import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import ToastContent from "../ui/ToastContent";
import { toast } from "react-hot-toast";

const CommentForm = ({
  productId,
  buyerId,
  refetch,
}: {
  productId: number;
  buyerId: number;
  refetch: () => Promise<void>;
}) => {
  const [comment, setComment] = useState("");
  const addCommentMutation = trpc.main.addComment.useMutation();
  const addComment = trpc.main.addComment.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="comment added successfully!" />
      );
      refetch();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await addComment.mutateAsync({
        productId,
        buyerId,
        text: comment,
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
    setComment(""); // Clear the input
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment..."
        className="w-full p-2 border rounded text-black"
        rows={3}
      />
      <button
        type="submit"
        className="mt-2 px-4 py-2 bg-blue-500 rounded text-black"
        disabled={addCommentMutation.isLoading}
      >
        {addCommentMutation.isLoading ? "Posting..." : "Post Comment"}
      </button>
    </form>
  );
};
export default CommentForm;
