import React from "react";

function RoundButton({ handleClick, Children }) {
  return (
    <div>
      <div
        onClick={handleClick}
        className="rounded-full bg-gradient-to-tr shadow-md shadow-gray-800 from-gra-100 to-gra-200 p-3 items-center text-center"
      >
        {Children}
      </div>
    </div>
  );
}

export default RoundButton;
