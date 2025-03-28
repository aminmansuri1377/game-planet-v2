// pages/singleProduct/[id].tsx
import React from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Loading from "../../components/ui/Loading";
import CustomButton from "../../components/ui/CustomButton";
import { toast } from "react-hot-toast";
import ToastContent from "../../components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomModal from "../../components/ui/CustomModal";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import jalaali from "jalaali-js";
import Image from "next/image";
import { isProfileComplete } from "../../../utils/checkProfileCompletion";
import CommentsSection from "@/components/ui/CommentsSection";
import { useRecoilState } from "recoil";
import { buyerLocationAtom } from "../../../store/atoms/buyerLocationAtom";
import Header from "@/components/Header";
import ImageSwapper from "@/components/ui/ImageSwapper";
import { CiCircleCheck } from "react-icons/ci";
import img2 from "../../../public/images/p2.webp";
import Counter from "@/components/ui/Counter";

function SingleProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const [finalAmount, setFinalAmount] = useState<number>(1);
  const [address, setAddress] = useState("");
  const [buyerLocation, setBuyerLocation] = useRecoilState(buyerLocationAtom);
  const {
    data: buyer,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getBuyerById.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );
  //
  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [rangeDate, setRangeDate] = useState<any>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  console.log("s & e", startDate, endDate);
  console.log("rangeDate", rangeDate);

  const handleUpdatePrice = () => {
    // setTotalPrice((prevPrice) => prevPrice * finalAmount);
  };
  // console.log("finalAmount", finalAmount);
  const [selectedSendingType, setSelectedSendingType] = useState<
    "SELLER_SENDS" | "BUYER_PICKS_UP" | null
  >(null);

  const closeModal = () => {
    setStartDate(null);
    setEndDate(null);
    setTotalPrice(0);
    setFinalAmount(1);
    setRangeDate([]);
    setOpen(false);
  };

  const createOrderMutation = trpc.main.createOrder.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Order created successfully!" />
      );
      setBuyerLocation(null);
      router.push("/");
    },
    onError: (err) => {
      console.log("err", err);
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });
  const createChatMutation = trpc.main.createChatRoom.useMutation({
    onSuccess: (data) => {
      router.push(`/chat?roomId=${data.id}`);
    },
    onError: (error) => {
      toast.custom(
        <ToastContent type="error" message="Failed to create chat room" />
      );
    },
  });

  const handleStartChat = () => {
    if (!session || !session.user) {
      toast.custom(
        <ToastContent type="error" message={t("rent.PleaseLogin")} />
      );
      return;
    }

    createChatMutation.mutate({
      userType1: "BUYER",
      userId1: userId!,
      userType2: "SELLER",
      userId2: productData && productData.sellerId,
    });
  };
  const persianToEnglishNumbers = (str: string) => {
    return (
      str && str?.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString())
    );
  };
  const convertToDate = (persianDate: string): Date => {
    // Check if persianDate is defined and is a string
    if (!persianDate || typeof persianDate !== "string") {
      throw new Error(
        "Invalid Persian date: Date is undefined or not a string"
      );
    }

    // Convert Persian numbers to English numbers
    const englishDate = persianToEnglishNumbers(persianDate);

    // Split the date string into parts
    const parts = englishDate.split("-");

    // Validate the parts array
    if (!parts || parts.length !== 3) {
      throw new Error(
        "Invalid Persian date format: Expected format is YYYY-MM-DD"
      );
    }

    // Convert parts to numbers
    const [jy, jm, jd] = parts.map(Number);

    // Validate the numbers
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) {
      throw new Error("Invalid numbers in date conversion");
    }

    // Convert Jalaali (Persian) date to Gregorian date
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);

    // Validate the Gregorian date
    if (isNaN(gy) || isNaN(gm) || isNaN(gd)) {
      throw new Error("Invalid Gregorian date conversion");
    }

    // Return the Gregorian date as a Date object
    return new Date(gy, gm - 1, gd); // Note: JavaScript months are 0-indexed
  };
  const calculateTotalPrice = (
    startDate: Date,
    endDate: Date,
    price: number,
    quantity: number
  ): number => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights * price * quantity; // Multiply by quantity
  };
  useEffect(() => {
    if (productData && startDate && endDate) {
      try {
        const startDateObj = convertToDate(startDate);
        const endDateObj = convertToDate(endDate);

        if (!(startDateObj instanceof Date) || !(endDateObj instanceof Date)) {
          console.error("Invalid date conversion:", {
            startDateObj,
            endDateObj,
          });
          setTotalPrice(null);
          return;
        }

        const totalPrice = calculateTotalPrice(
          startDateObj,
          endDateObj,
          productData.price,
          finalAmount
        );
        setTotalPrice(totalPrice);
      } catch (error) {
        console.error("Error calculating total price:", error);
        setTotalPrice(null);
      }
    }
  }, [startDate, endDate, finalAmount, productData]);
  const handleOrder = () => {
    if (!session || !session.user) {
      toast.custom(
        <ToastContent type="error" message={t("rent.PleaseLogin")} />
      );
      return;
    }
    if (!buyerLocation) {
      toast.custom(
        <ToastContent type="error" message="Please set your location first." />
      );
      return;
    }

    if (productData) {
      if (productData.sendingType.length > 1 && !selectedSendingType) {
        toast.custom(
          <ToastContent type="error" message="Please select a sending type." />
        );
        return;
      }

      const sendingType =
        productData.sendingType.length === 1
          ? productData.sendingType[0]
          : selectedSendingType;

      try {
        if (!startDate || !endDate || !totalPrice) {
          throw new Error("Start date, end date, or total price is missing.");
        }

        const startDateObj = convertToDate(startDate);
        const endDateObj = convertToDate(endDate);

        if (!(startDateObj instanceof Date) || !(endDateObj instanceof Date)) {
          throw new Error("Invalid date conversion");
        }

        createOrderMutation.mutate({
          productId: productData.id,
          userId: userId,
          sellerId: productData.sellerId,
          status: "waiting for confirmation",
          sendingType: sendingType!,
          startDate: startDateObj.toISOString(),
          endDate: endDateObj.toISOString(),
          totalPrice: totalPrice, // Use the calculated totalPrice
          latitude: buyerLocation.latitude,
          longitude: buyerLocation.longitude,
          quantity: finalAmount,
          address: address,
        });
      } catch (error) {
        console.log("in error", error);
        toast.custom(
          <ToastContent
            type="error"
            message="Invalid date format or calculation."
          />
        );
      }
    }
    setOpen(false);
  };
  const handleDateChange = (dates: any) => {
    if (Array.isArray(dates)) {
      const formattedDates = dates
        .map((date) => {
          if (date && date.format) {
            return date.format("YYYY-MM-DD"); // Use standard format first
          }
          return null;
        })
        .filter((date) => date);

      if (formattedDates.length === 2) {
        const [firstDate, secondDate] = formattedDates;

        // Convert to Jalaali (Persian) format if needed
        const jalaaliFirst = firstDate.split("-").join("-");
        const jalaaliSecond = secondDate.split("-").join("-");

        // Ensure start date is before end date
        if (firstDate > secondDate) {
          setStartDate(jalaaliSecond);
          setEndDate(jalaaliFirst);
          setRangeDate([jalaaliSecond, jalaaliFirst]);
        } else {
          setStartDate(jalaaliFirst);
          setEndDate(jalaaliSecond);
          setRangeDate([jalaaliFirst, jalaaliSecond]);
        }

        // Calculate total price
        if (productData) {
          try {
            const startDateObj = convertToDate(jalaaliFirst);
            const endDateObj = convertToDate(jalaaliSecond);

            if (startDateObj && endDateObj) {
              const totalPrice = calculateTotalPrice(
                startDateObj,
                endDateObj,
                productData.price,
                finalAmount
              );
              setTotalPrice(totalPrice);
            }
          } catch (error) {
            console.error("Error converting dates:", error);
            toast.custom(
              <ToastContent
                type="error"
                message="Invalid date format selected."
              />
            );
            setTotalPrice(null);
          }
        }
      }
    }
  };
  // console.log("buyer", buyer);
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!productData) return <p>Product not found</p>;
  if (!isProfileComplete(buyer)) {
    return (
      <div>
        <div onClick={() => router.back()}>
          <FaArrowLeftLong />
        </div>
        <div className="mt-4 text-center">
          <p>Please complete your profile before creating a product.</p>
          <button
            onClick={() => router.push("/buyer/completeProfile")}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }
  // console.log("productData.images", productData.images);
  return (
    <div>
      <div className=" px-5">
        <Header />
        <div onClick={() => router.back()} className=" mt-2 mb-6">
          <FaArrowLeftLong />
        </div>
        <CustomButton
          onClick={handleStartChat}
          title="چت با فروشنده"
          type="secondary-btn"
          loading={createChatMutation.isLoading}
        />
        {productData && (
          <div>
            <ImageSwapper images={productData.images} />
            <div className=" my-2 flex justify-between items-center">
              <CustomButton
                title={`شبی ${productData.price}`}
                type="primary-btn"
              />
              <h1 className="font-PeydaBold text-2xl text-center mr-5">
                {productData.name}
              </h1>
            </div>
            <p className="font-PeydaBold text-sm text-end mt-5 mx-8">
              {productData.description}
            </p>
            <div className=" bg-cardbg rounded-xl px-3 py-5 my-6">
              <div>
                <h1 className=" font-PeydaBold text-text1 text-center">{`اجاره دهنده : ${productData.sellerId}`}</h1>
              </div>
              <div className="">
                <div className=" flex justify-end m-5">
                  <h1 className=" font-PeydaRegular mx-5">
                    تایید شده توسط رنتا
                  </h1>
                  <CiCircleCheck size={20} className=" text-green-500" />
                </div>
              </div>
            </div>
            <div className=" text-center">
              {productData.category && (
                <p className="font-PeydaBold text-sm">
                  دسته بندی: {productData.category.name}
                </p>
              )}
              {productData.guaranty && (
                <p className="font-PeydaBold text-sm">
                  نوع ضمانت: {productData.guaranty.text}
                </p>
              )}
            </div>
          </div>
        )}

        <CustomButton
          onClick={() => setOpen(true)}
          title={t("rent.order")}
          type="primary-btn"
        />
        <CustomModal type="general" show={open} onClose={closeModal}>
          <div>
            <div className=" my-2">{totalPrice}</div>
            <div className=" my-2">{finalAmount}</div>

            <div className="flex justify-center">
              <CustomDatePicker
                range
                textBtn="بازه زمانی را مشخص کنید"
                value={[startDate, endDate].filter((date) => date)} // Pass both dates as an array
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
                <h2 className="font-PeydaBold text-lg">
                  تاریخ پس دادن: {endDate}
                </h2>
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
                    {productData.name}
                  </h1>
                  <Counter
                    text=": تعداد"
                    quantity={finalAmount}
                    amount={finalAmount}
                    onUpdatePrice={handleUpdatePrice}
                    onUpdateQuantity={setFinalAmount}
                  />
                </div>
              </div>
            )}
            <h1 className=" font-PeydaRegular">انتخاب نوع تحویل</h1>
            {productData.sendingType.length > 1 ? (
              <div className=" my-3">
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
              <p>{t(`rent.${productData.sendingType[0]}`)}</p>
            )}
            <input
              type="text"
              placeholder="آدرس دقیق را وارد کنید"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className=" text-black my-3"
            />
            <CustomButton
              onClick={handleOrder}
              title={t("rent.order")}
              type="primary-btn"
              loading={createOrderMutation.isLoading}
            />
          </div>
        </CustomModal>
      </div>
      <div>
        <div>
          <CommentsSection productId={productData.id} buyerId={userId} />
        </div>
      </div>
    </div>
  );
}

export default SingleProductPage;
