import Image from "next/image";
import React from "react";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

function ProductCard({
  imgUrl,
  imgAlt,
  name,
  price,
  handleSave,
  isSaved,
  rate,
  distance,
}) {
  // console.log("distance", distance);
  return (
    <div className="rounded-xl bg-cardbg my-4 ">
      <div className="relative">
        <Image
          src={imgUrl}
          alt={imgAlt}
          width={150}
          height={150}
          className="w-full rounded-t-xl"
        />
        {/* Save button positioned absolutely within image container */}
        <button
          className="absolute top-2 right-2 p-2 bg-secondary rounded-full backdrop-blur-sm"
          onClick={(e) => handleSave(e)}
        >
          {isSaved ? (
            <FaBookmark size={20} className="text-white" />
          ) : (
            <FaRegBookmark size={20} className="text-white" />
          )}
        </button>
      </div>
      <div className="text-center m-4">
        <h1 className="font-PeydaBold text-text1 text-lg">{name}</h1>
        <h2 className="font-PeydaRegular text-text2 my-1">{`شبی ${price} تومان`}</h2>
        <div className="flex justify-around mt-4">
          <div className=" px-2 mr-5 py-1 rounded-full flex justify-around text-center items-center">
            <FaHeart className="text-primary mx-1" />
            <h3 className="text-sm text-text2 font-PeydaRegular mx-1">
              {rate}/5
            </h3>
          </div>
          {distance && (
            <div className=" p-1 px-2 text-primary text-xs">
              {distance.toFixed(1)} km
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
