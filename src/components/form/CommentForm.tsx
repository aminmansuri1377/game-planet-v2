import { useState } from "react";
import { trpc } from "../../../utils/trpc";
import ToastContent from "../ui/ToastContent";
import { toast } from "react-hot-toast";
import { TextAreaInput } from "../ui/textAreaInput";
import CustomButton from "../ui/CustomButton";

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
    <form onSubmit={handleSubmit} className="mt-6 flex">
      <TextAreaInput
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="نظر خود را بنویسید "
        className="w-full p-2 border rounded "
        rows={2}
      />
      <CustomButton
        type="primary-btn"
        title={addCommentMutation.isLoading ? "Posting..." : "ثبت"}
        className="mt-2 bg-blue-500 rounded "
        disabled={addCommentMutation.isLoading}
      />
    </form>
  );
};
export default CommentForm;
