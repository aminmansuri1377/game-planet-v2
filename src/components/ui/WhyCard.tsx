import React from "react";

function WhyCard({ Icon, text, title }) {
  return (
    <div>
      <div className=" rounded-full bg-cardbg px-4 py-8 text-center">
        <Icon size={80} className=" mx-auto text-primary" />
      </div>
      <h1 className=" font-PeydaBold text-white text-2xl my-3">{title}</h1>
      <h1 className=" font-PeydaBold text-white">{text}</h1>
    </div>
  );
}

export default WhyCard;
