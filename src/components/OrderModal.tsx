// components/product/OrderModal.tsx
import { useState } from "react";
import CustomButton from "./ui/CustomButton";
import CustomDatePicker from "./ui/CustomDatePicker";
import Image from "next/image";
import img2 from "../../public/images/p2.webp";
import Counter from "./ui/Counter";
import { Product } from "@prisma/client"; // Adjust import based on your types
import CustomModal from "./ui/CustomModal";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrder: () => void;
  product: Product;
  totalPrice: number;
  setTotalPrice: (price: number) => void;
  finalAmount: number;
  setFinalAmount: (amount: number) => void;
  startDate: string | null;
  setStartDate: (date: string | null) => void;
  endDate: string | null;
  setEndDate: (date: string | null) => void;
  selectedSendingType: "SELLER_SENDS" | "BUYER_PICKS_UP" | null;
  setSelectedSendingType: (
    type: "SELLER_SENDS" | "BUYER_PICKS_UP" | null
  ) => void;
  address: string;
  setAddress: (address: string) => void;
  isLoading: boolean;
}

export function OrderModal({
  isOpen,
  onClose,
  onOrder,
  product,
  totalPrice,
  setTotalPrice,
  finalAmount,
  setFinalAmount,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  selectedSendingType,
  setSelectedSendingType,
  address,
  setAddress,
  isLoading,
}: OrderModalProps) {
  const handleDateChange = (dates: any) => {
    if (Array.isArray(dates)) {
      const formattedDates = dates
        .map((date) => {
          if (date && date.format) {
            return date.format("YYYY-MM-DD");
          }
          return null;
        })
        .filter((date) => date);

      if (formattedDates.length === 2) {
        const [firstDate, secondDate] = formattedDates;

        if (firstDate > secondDate) {
          setStartDate(secondDate);
          setEndDate(firstDate);
        } else {
          setStartDate(firstDate);
          setEndDate(secondDate);
        }
      }
    }
  };

  return (
    <CustomModal type="general" show={isOpen} onClose={onClose}>
      <div>
        <div className="my-2">{totalPrice}</div>
        <div className="my-2">{finalAmount}</div>

        <div className="flex justify-center">
          <CustomDatePicker
            range
            textBtn="بازه زمانی را مشخص کنید"
            value={[startDate, endDate].filter((date) => date)}
            onChange={handleDateChange}
            dateSeparator=" تا "
          />
        </div>
        {startDate && (
          <div className="text-center mt-4">
            <h2 className="font-PeydaBold text-lg">
              تاریخ تحویل گرفتن: {startDate}
            </h2>
          </div>
        )}
        {endDate && (
          <div className="text-center mt-4">
            <h2 className="font-PeydaBold text-lg">تاریخ پس دادن: {endDate}</h2>
          </div>
        )}
        {startDate && endDate && (
          <div className="rounded-xl bg-cardbg my-4 flex justify-between">
            <Image
              src={img2}
              alt="p"
              width={150}
              height={150}
              className="rounded-l-xl"
            />
            <div className="text-center m-4">
              <h1 className="font-PeydaBold text-text1 text-xl">
                {product.name}
              </h1>
              <Counter
                text=": تعداد"
                quantity={finalAmount}
                amount={finalAmount}
                onUpdateQuantity={setFinalAmount}
              />
            </div>
          </div>
        )}
        <h1 className="font-PeydaRegular">انتخاب نوع تحویل</h1>
        {product?.sendingType.length > 1 ? (
          <div className="my-3">
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedSendingType === "SELLER_SENDS"}
                onChange={() => setSelectedSendingType("SELLER_SENDS")}
                className="form-radio"
              />
              <span className="font-PeydaBold">خودش برام میاره</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedSendingType === "BUYER_PICKS_UP"}
                onChange={() => setSelectedSendingType("BUYER_PICKS_UP")}
                className="form-radio"
              />
              <span className="font-PeydaBold">باید برم بگیرم ازش</span>
            </label>
          </div>
        ) : (
          <p>{product.sendingType[0]}</p>
        )}
        <input
          type="text"
          placeholder="آدرس دقیق را وارد کنید"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="text-black my-3 p-5 rounded-lg font-PeydaRegular"
        />
        <CustomButton
          onClick={onOrder}
          title="سفارش"
          type="primary-btn"
          loading={isLoading}
        />
      </div>
    </CustomModal>
  );
}
