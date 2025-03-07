import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import CustomButton from "./CustomButton";

interface Counter {
  text?: string;
  amount?: number;
  onUpdatePrice?: (amount: number) => void;
  quantity?: number;
  onUpdateQuantity?: React.Dispatch<React.SetStateAction<number>>;
}
const Counter: React.FC<Counter> = ({
  text,
  amount,
  onUpdatePrice,
  quantity,
  onUpdateQuantity,
}) => {
  const handleIncrement = () => {
    if (quantity < 6) {
      onUpdateQuantity(quantity + 1);
      onUpdatePrice(amount);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      onUpdateQuantity(quantity - 1);
      onUpdatePrice(-amount);
    }
  };

  return (
    <div
      className={`flex justify-between relative rounded-3xl shadow-2xl text-center my-3 items-start`}
    >
      <div className=" flex justify-around">
        <button onClick={handleDecrement}>
          <IoMdArrowDropleft size={30} />
        </button>
        <h2 className="mx-2">{quantity}</h2>
        <button onClick={handleIncrement}>
          <IoMdArrowDropright size={30} />
        </button>
      </div>

      <h1 className=" font-PeydaMedium mt-1 ml-2">{text}</h1>
    </div>
  );
};

export default Counter;
