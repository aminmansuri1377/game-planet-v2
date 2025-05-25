import Image from "next/image";
import React from "react";

function CategoryCart({ text, Icon }) {
  return (
    <div className="h-full item-center rounded-xl bg-cardbg p-3 text-center">
      {/* <Icon size={30} className="my-1 mx-auto" /> */}
      {Icon && (
        <Image
          src={Icon}
          alt={text}
          className="w-full object-contain"
          width={20}
          height={20}
        />
      )}
      <h1 className=" font-PeydaBold">{text}</h1>
    </div>
  );
}

export default CategoryCart;
