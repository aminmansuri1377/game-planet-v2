import React from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/Loading";
import CustomButton from "@/components/ui/CustomButton";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomModal from "@/components/ui/CustomModal";
import DeviceCard from "@/components/ui/DeviceCard";

function SingleProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const { data: session, status } = useSession();
  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });
  const [open, setOpen] = useState(false);
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

      createOrderMutation.mutate({
        productId: productData.id,
        userId: session.user.id,
        sellerId: productData.sellerId,
        status: "waiting for confirmation",
        sendingType: sendingType!, // Ensure sendingType is not null
      });
    }
    setOpen(false);
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
          <div className="flex justify-between relative py-3 px-6 md:px-12 rounded-full shadow-2xl text-center my-6 bg-white bg-opacity-10 border-2 border-transparent border-purple-900">
            <h1 className="font-PeydaBold text-lg">{t("rent.price")}</h1>
            <h1 className="font-PeydaBold text-2xl">{productData.price}</h1>
            <h1 className="font-PeydaBold">تومان</h1>
          </div>
          <p className="font-PeydaBold text-lg">{t("rent.description")}</p>
          <p className="font-PeydaBold text-sm">{productData.description}</p>
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
