import React from "react";

function CategoryCart({ text, Icon }) {
  return (
    <div className=" rounded-xl bg-cardbg p-3 text-center">
      <Icon size={30} className="my-1 mx-auto" />
      <h1 className=" font-PeydaBold">{text}</h1>
    </div>
  );
}

export default CategoryCart;
