import { trpc } from "../../../utils/trpc";
import CommentForm from "../form/CommentForm";

const CommentsSection = ({
  productId,
  buyerId,
}: {
  productId: number;
  buyerId: number | null;
}) => {
  const {
    data: comments,
    isLoading,
    refetch,
  } = trpc.main.getCommentsByProduct.useQuery({
    productId,
  });
  const deleteCommentMutation = trpc.main.deleteComment.useMutation();

  const handleDelete = async (commentId: number) => {
    if (!buyerId) return;

    try {
      await deleteCommentMutation.mutateAsync({ commentId, buyerId });
      refetch(); // Refetch comments after deletion
    } catch (error) {
      console.error("Failed to delete comment:", error);
    }
  };

  if (isLoading) return <p>Loading comments...</p>;

  return (
    <div className="mt-6">
      <CommentForm productId={productId} buyerId={buyerId} refetch={refetch} />
      <h2 className="text-xl font-bold mb-4">Comments</h2>

      {comments.map((comment) => (
        <div key={comment.id} className="mb-4 p-4 border rounded">
          <p className="text-gray-700">{comment.text}</p>
          <p className="text-sm text-gray-500">
            By {comment?.buyer?.firstName} {comment?.buyer?.lastName} on{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </p>
          {buyerId === comment.buyerId && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
              disabled={deleteCommentMutation.isLoading}
            >
              {deleteCommentMutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
export default CommentsSection;
