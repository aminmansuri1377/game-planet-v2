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
import DeviceCard from "../../components/ui/DeviceCard";
import CustomDatePicker from "../../components/ui/CustomDatePicker";
import jalaali from "jalaali-js";

function SingleProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number | null>(null);

  const [selectedSendingType, setSelectedSendingType] = useState<
    "SELLER_SENDS" | "BUYER_PICKS_UP" | null
  >(null);

  const closeModal = () => {
    setOpen(false);
  };

  const createOrderMutation = trpc.main.createOrder.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Order created successfully!" />
      );
      router.push("/");
    },
    onError: (err) => {
      console.log("err", err);
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const persianToEnglishNumbers = (str: string) => {
    return str.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  };
  const convertToDate = (persianDate: string) => {
    const englishDate = persianToEnglishNumbers(persianDate);
    const parts = englishDate.split("-");
    if (parts.length !== 3) {
      throw new Error("Invalid Persian date format");
    }
    const [jy, jm, jd] = parts.map(Number);
    if (isNaN(jy) || isNaN(jm) || isNaN(jd)) {
      throw new Error("Invalid numbers in date conversion");
    }
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    if (isNaN(gy) || isNaN(gm) || isNaN(gd)) {
      throw new Error("Invalid Gregorian date conversion");
    }
    return new Date(gy, gm - 1, gd);
  };
  const calculateTotalPrice = (
    startDate: Date,
    endDate: Date,
    price: number
  ): number => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights * price;
  };
  const handleOrder = () => {
    if (!session || !session.user) {
      toast.custom(
        <ToastContent type="error" message={t("rent.PleaseLogin")} />
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

      if (rangeDate.length !== 2) {
        toast.custom(
          <ToastContent
            type="error"
            message="Please select a valid date range."
          />
        );
        return;
      }

      try {
        const startDate = convertToDate(rangeDate[0]);
        const endDate = convertToDate(rangeDate[1]);

        if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
          throw new Error("Invalid date conversion");
        }

        const totalPrice = calculateTotalPrice(
          startDate,
          endDate,
          productData.price
        );

        createOrderMutation.mutate({
          productId: productData.id,
          userId: session.user.id,
          sellerId: productData.sellerId,
          status: "waiting for confirmation",
          sendingType: sendingType!,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          totalPrice: totalPrice,
        });
      } catch (error) {
        toast.custom(
          <ToastContent type="error" message="Invalid date format." />
        );
      }
    }
    setOpen(false);
  };

  const [rangeDate, setRangeDate] = useState<any>([]);

  const handleDateChange = (dates: any) => {
    if (Array.isArray(dates) && dates.length === 2) {
      const formattedDates = dates.map((date) => date?.format?.("YYYY-MM-DD"));
      setRangeDate(formattedDates);

      if (!productData || typeof productData.price !== "number") {
        console.error(
          "Product price is missing or invalid:",
          productData?.price
        );
        setTotalPrice(null);
        return;
      }

      const startDate = convertToDate(formattedDates[0]);
      const endDate = convertToDate(formattedDates[1]);

      if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
        console.error("Invalid date conversion:", { startDate, endDate });
        setTotalPrice(null);
        return;
      }

      const totalPrice = calculateTotalPrice(
        startDate,
        endDate,
        productData.price
      );
      setTotalPrice(totalPrice);
    } else {
      setRangeDate([]);
      setTotalPrice(null);
    }
  };
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!productData) return <p>Product not found</p>;
  return (
    <div>
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <DeviceCard product={productData.name} info={productData.description} />
      {productData && (
        <div>
          <h1 className="font-PeydaBold text-2xl">{productData.name}</h1>
          <div className="flex justify-between relative py-3 px-6 md:px-12 rounded-full shadow-2xl text-center my-6 bg-white bg-opacity-10 border-2 border-transparent border-purple-900">
            <h1 className="font-PeydaBold text-lg">{t("rent.price")}</h1>
            <h1 className="font-PeydaBold text-2xl">{productData.price}</h1>
            <h1 className="font-PeydaBold">تومان</h1>
          </div>
          <p className="font-PeydaBold text-lg">{t("rent.description")}</p>
          <p className="font-PeydaBold text-sm">{productData.description}</p>
          {productData.category && (
            <p className="font-PeydaBold text-sm">
              Category: {productData.category.name}
            </p>
          )}
          {productData.guaranty && (
            <p className="font-PeydaBold text-sm">
              Category: {productData.guaranty.text}
            </p>
          )}
        </div>
      )}
      <div className="flex justify-center">
        <CustomDatePicker
          range
          textBtn="بازه زمانی را مشخص کنید"
          value={rangeDate}
          onChange={handleDateChange}
          dateSeparator=" تا "
        />
      </div>
      {totalPrice !== null && (
        <div className="text-center mt-4">
          <h2 className="font-PeydaBold text-lg">
            Total Price: {totalPrice} تومان
          </h2>
        </div>
      )}
      <CustomButton
        onClick={() => setOpen(true)}
        title={t("rent.order")}
        type="primary-btn"
      />
      <CustomModal type="general" show={open} onClose={closeModal}>
        <h1>Select Sending Type</h1>
        {productData.sendingType.length > 1 ? (
          <div>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedSendingType === "SELLER_SENDS"}
                onChange={() => setSelectedSendingType("SELLER_SENDS")}
                className="form-radio"
              />
              <span>{t("rent.sellerSends")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="radio"
                checked={selectedSendingType === "BUYER_PICKS_UP"}
                onChange={() => setSelectedSendingType("BUYER_PICKS_UP")}
                className="form-radio"
              />
              <span>{t("rent.buyerPicksUp")}</span>
            </label>
          </div>
        ) : (
          <p>{t(`rent.${productData.sendingType[0]}`)}</p>
        )}
        <CustomButton
          onClick={handleOrder}
          title={t("rent.order")}
          type="primary-btn"
          loading={createOrderMutation.isLoading}
        />
      </CustomModal>
    </div>
  );
}

export default SingleProductPage;
