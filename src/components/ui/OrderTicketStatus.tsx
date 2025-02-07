import React from "react"                                
                     import { useTranslation } from "react-i18next";;

function OrderTicketStatus({ Icon, text, isActive, handleClick }) {
  return (
    <button
      onClick={handleClick}
      className="flex my-3 justify-between w-full bg-slate-400 bg-opacity-50 rounded-lg p-2 items-center"
    >
      <Icon
        size={30}
        className="my-1 mx-1"
        color={isActive ? "lightGreen" : "white"}
      />
      <h1
        className={`font-PeydaBold text-sm ${
          isActive ? "text-green-400" : "text-white"
        }`}
      >
        {text}
      </h1>
    </button>
  );
}

export default OrderTicketStatus;
