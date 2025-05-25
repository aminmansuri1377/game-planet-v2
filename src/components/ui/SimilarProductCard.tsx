import Image from "next/image";
import React from "react";

function SimilarProductCard({ imgUrl, imgAlt, name, price }) {
  // console.log("distance", distance);
  return (
    <div className="rounded-xl bg-cardbg my-4 h-full ">
      <div className="relative">
        <Image
          src={imgUrl}
          alt={imgAlt}
          width={150}
          height={150}
          className="w-full rounded-t-xl"
        />
      </div>
      <div className="text-center m-4">
        <h1 className="font-PeydaBold text-text1 text-lg">{name}</h1>
        <h2 className="font-PeydaRegular text-text2 my-1">{`شبی ${price} تومان`}</h2>
        <div className="flex justify-around mt-4"></div>
      </div>
    </div>
  );
}

export default SimilarProductCard;
