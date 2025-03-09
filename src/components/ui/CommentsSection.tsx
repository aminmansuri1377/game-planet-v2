import { trpc } from "../../../utils/trpc";
import CommentForm from "../form/CommentForm";
import CommentCard from "./CommentCard";

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
      <div className="px-4">
        <CommentForm
          productId={productId}
          buyerId={buyerId}
          refetch={refetch}
        />
      </div>
      <h2 className="text-xl mt-3 font-PeydaBold text-end mb-4">
        : نظرات دیگران به این محصول
      </h2>
      {comments && (
        <CommentCard
          comments={comments}
          buyerId={buyerId}
          handleDelete={handleDelete}
          loading={
            deleteCommentMutation?.isLoading && deleteCommentMutation?.isLoading
          }
        />
      )}
    </div>
  );
};
export default CommentsSection;
