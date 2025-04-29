// components/product/ProductDetails.tsx
import Image from "next/image";
import { Product } from "@prisma/client"; // Adjust import based on your types
import CustomButton from "./ui/CustomButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import ImageSwapper from "./ui/ImageSwapper";
import { CiCircleCheck } from "react-icons/ci";

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onStartChat: () => void;
}

export function ProductDetails({
  product,
  onBack,
  onStartChat,
}: ProductDetailsProps) {
  return (
    <div>
      <div onClick={onBack} className="mt-2 mb-6">
        <FaArrowLeftLong />
      </div>
      <CustomButton
        onClick={onStartChat}
        title="چت با فروشنده"
        type="secondary-btn"
      />
      <div>
        <ImageSwapper images={product.images} />
        <div className="my-2 flex justify-between items-center">
          <CustomButton title={`شبی ${product?.price}`} type="primary-btn" />
          <h1 className="font-PeydaBold text-2xl text-center mr-5">
            {product?.name}
          </h1>
        </div>
        <p className="font-PeydaBold text-sm text-end mt-5 mx-8">
          {product?.description}
        </p>
        <div className="bg-cardbg rounded-xl px-3 py-5 my-6">
          <div>
            <h1 className="font-PeydaBold text-text1 text-center">{`اجاره دهنده : ${product?.sellerId}`}</h1>
          </div>
          <div className="">
            <div className="flex justify-end m-5">
              <h1 className="font-PeydaRegular mx-5">تایید شده توسط رنتا</h1>
              <CiCircleCheck size={20} className="text-green-500" />
            </div>
            <div className="text-center">
              {product?.category && (
                <p className="font-PeydaBold text-sm ">
                  دسته بندی: {product?.category.name}
                </p>
              )}
              {product?.guaranty && (
                <p className="font-PeydaBold text-sm mt-5">
                  نوع ضمانت: {product?.guaranty.text}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
