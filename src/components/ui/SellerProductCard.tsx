import Image from "next/image";
import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

function SellerProductCard({
  imgUrl,
  imgAlt,
  name,
  price,
  //   handleSave,
  //   isSaved,
  rate,
}) {
  return (
    <div className="rounded-xl bg-cardbg my-4 ">
      <Image
        src={imgUrl}
        alt={imgAlt}
        width={150}
        height={150}
        className=" w-full rounded-t-xl"
      />
      <div className="text-center m-4">
        <h1 className="font-PeydaBold text-text1 text-lg">{name}</h1>
        <h2 className="font-PeydaBold text-text2 my-1">{`شبی ${price} تومان`}</h2>
        <div className="flex justify-around mt-4">
          <div className=" px-2 mr-5 py-1 rounded-full flex justify-around text-center items-center">
            <FaHeart className="text-primary mx-1" />
            <h3 className="text-sm text-text2 font-PeydaRegular mx-1">
              {rate}/5
            </h3>
          </div>
          {/* <button
            className=""
            onClick={(e) => handleSave(e)} // Pass the event to the parent handler
          >
            {isSaved ? (
              <FaBookmark size={20} className="text-primary" />
            ) : (
              <FaRegBookmark size={20} className="text-primary" />
            )}
          </button> */}
        </div>
      </div>
    </div>
  );
}

export default SellerProductCard;
