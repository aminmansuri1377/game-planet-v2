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
      <h2 className="text-xl mt-3 font-PeydaBold text-end mb-4">
        : نظرات دیگران به این محصول
      </h2>

      {/* {comments.map((comment) => (
        <div key={comment.id}> */}
      {comments && (
        <div className="w-4/5">
          <CommentCard
            comments={comments}
            buyerId={buyerId}
            handleDelete={handleDelete}
            loading={
              deleteCommentMutation?.isLoading &&
              deleteCommentMutation?.isLoading
            }
          />
        </div>
      )}
      <CommentForm productId={productId} buyerId={buyerId} refetch={refetch} />
      {/* <p className="text-gray-700">{comment.text}</p>
          <p className="text-sm text-gray-500">
            By {comment?.buyer?.firstName} {comment?.buyer?.lastName} on{" "}
            {new Date(comment.createdAt).toLocaleDateString()}
          </p> */}
      {/* {buyerId === comment.buyerId && (
            <button
              onClick={() => handleDelete(comment.id)}
              className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
              disabled={deleteCommentMutation.isLoading}
            >
              {deleteCommentMutation.isLoading ? "Deleting..." : "Delete"}
            </button>
          )} */}
      {/* </div>
      ))} */}
    </div>
  );
};
export default CommentsSection;
