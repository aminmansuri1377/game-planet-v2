import React from "react";

function CommentCard({ comments, buyerId, handleDelete, loading }) {
  return (
    <div className="  mx-3 px-1">
      {comments &&
        comments.map((comment) => (
          <div
            key={comment?.id}
            className=" mr-2 my-4 bg-cardbg w-4/5 rounded-tr-2xl rounded-bl-2xl p-6 text-end"
          >
            <h1 className="font-PeydaBold text-xl text-text1">
              {comment?.buyerId}
            </h1>
            <h1 className="font-PeydaBold text-text2">{comment?.text}</h1>
            <div className=" text-left">
              {buyerId === comment.buyerId && (
                <button
                  onClick={() => handleDelete(comment.id)}
                  className="mt-2 px-2 py-1 bg-red-500 text-white rounded text-sm"
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}

export default CommentCard;
