import React, { useState } from "react"               
                                      import { useTranslation } from "react-i18next";;
import { IoMdArrowDropright } from "react-icons/io";
import { IoMdArrowDropleft } from "react-icons/io";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";
import CustomButton from "./ui/CustomButton";

interface OrderDetails {
  type?: string;
  text?: string;
  data?: any;
  amount?: number;
  onUpdatePrice?: (amount: number) => void;
  quantity?: number;
  onUpdateQuantity?: React.Dispatch<React.SetStateAction<number>>;
  isChecked?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
  onSelectPackage?: (
    packageId?: number,
    packageName?: string,
    packagePrice?: number
  ) => void;
}
const OrderDetails: React.FC<OrderDetails> = ({
  type,
  text,
  data,
  amount,
  onUpdatePrice,
  quantity,
  onUpdateQuantity,
  isChecked,
  onCheckboxChange,
  onSelectPackage,
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckboxChange(e.target.checked);
  };
  const [openIndex, setOpenIndex] = useState<null | number>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleOptionSelect = (option: {
    id: number;
    name: string;
    price: number;
  }) => {
    setSelectedOption(option.name);
    setSelectedOptionId(option.id);
    onSelectPackage(+option.id, option.name, option.price);
    setOpenIndex(null);
  };
  // console.log("Selected option:", openIndex);

  // console.log("dataadata", data);
  return (
    <div
      className={`flex justify-between relative py-3 px-6 md:px-12 ${
        type === "select" ? "rounded-3xl" : "rounded-full"
      }   shadow-2xl text-center my-3
     bg-white bg-opacity-10 border-2 border-transparent border-purple-900`}
    >
      {type === "counter" ? (
        <div className=" flex justify-around">
          <button onClick={handleDecrement}>
            <IoMdArrowDropleft size={30} />
          </button>
          <h2 className="mx-2">{quantity}</h2>
          <button onClick={handleIncrement}>
            <IoMdArrowDropright size={30} />
          </button>
        </div>
      ) : type === "checkbox" ? (
        <label>
          <input
            type="checkbox"
            checked={isChecked}
            onChange={handleChange}
            className="hidden"
          />
          <span
            className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors duration-200 
              ${
                isChecked
                  ? "bg-blue-800 border-blue-500"
                  : "bg-white border-gray-400"
              }`}
          >
            {isChecked && (
              <svg
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
          </span>
        </label>
      ) : type === "select" ? (
        <div>
          <div className="">
            <div className="pl-4 pr-4 pt-2 pb-4 flex flex-col space-y-2">
              {data &&
                data?.map((item) => (
                  <CustomButton
                    key={item.id}
                    type={
                      selectedOptionId === item.id
                        ? "border-purple-btn"
                        : "primary-btn"
                    }
                    title={
                      <>
                        {item.name} - ${item.price} - ${item.inventory}
                        {item.inventory === 0 && "(Out of stock)"}
                      </>
                    }
                    onClick={() => handleOptionSelect(item)}
                    disabled={item.inventory === 0}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <h1 className=" font-PeydaMedium">{text}</h1>
    </div>
  );
};

export default OrderDetails;
