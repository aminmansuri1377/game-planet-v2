import Image from "next/image";
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
            <div className=" flex gap-4 justify-end">
              <h1 className="font-PeydaBold text-lg text-text1 mt-3">
                {comment?.buyer?.firstName}
                {comment?.buyer?.lastName}
              </h1>
              {comment &&
                comment?.buyer?.profileImage &&
                comment?.buyer?.profileImage.length !== 0 && (
                  <Image
                    src={comment?.buyer?.profileImage[0]}
                    alt={`Slide`}
                    className=" object-cover rounded-full"
                    width={40}
                    height={40}
                    loading="lazy"
                  />
                )}
            </div>
            <h1 className="font-PeydaBold text-text2 mt-2">{comment?.text}</h1>
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
