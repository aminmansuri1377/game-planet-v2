import React from "react";
import { useTranslation } from "react-i18next";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import OrderDetails from "@/components/OrderDetails";
import { trpc } from "../../utils/trpc";
import { useSession } from "next-auth/react";
import Loading from "@/components/ui/Loading";
import CustomButton from "@/components/ui/CustomButton";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import CustomModal from "@/components/ui/CustomModal";
import DeviceCard from "@/components/ui/DeviceCard";

function SinglePage() {
  const { t } = useTranslation();

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { data: session, status } = useSession();
  const { product } = router.query;
  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductByName.useQuery(
    { name: product as string },
    { enabled: !!product }
  );
  const [open, setOpen] = useState(false);

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
      {
        toast.custom(<ToastContent type="error" message={err?.message} />);
      }
    },
  });
  const [finalPrice, setFinalPrice] = useState(0);
  const [isInstallationChecked, setIsInstallationChecked] = useState(false);
  const [isRulesChecked, setIsRulesChecked] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number>();

  useEffect(() => {
    if (productData) {
      setFinalPrice(productData.initialPrice);
    }
  }, [productData]);
  const handleInstallationChange = (checked: boolean) => {
    if (productData) {
      const installationCost = productData.installation;
      setFinalPrice(
        (prevPrice) =>
          prevPrice + (checked ? installationCost : -installationCost)
      );
      setIsInstallationChecked(checked);
    }
  };
  const handleRulesChange = (e) => {
    setIsRulesChecked(e.target.checked);
  };
  const handlePackageSelect = (
    packageId: number,
    packageName: string,
    packagePrice: number
  ) => {
    setFinalPrice(
      (prev) =>
        prev -
        (selectedPackageId
          ? productData?.packages.find((p) => p.id === selectedPackageId)
              ?.price || 0
          : 0) +
        packagePrice
    );
    setSelectedPackage(packageName);
    setSelectedPackageId(packageId);
  };
  const [finalControllerAmount, setFinalControllerAmount] = useState(1);
  const [finalNightsAmount, setFinalNightsAmount] = useState(1);
  // console.log(
  //   "first",
  //   finalPrice,
  //   "////",
  //   finalControllerAmount,
  //   "/////",
  //   finalNightsAmount,
  //   "/////",
  //   isInstallationChecked,
  //   "//////////",
  //   selectedPackage
  // );
  if (isLoading)
    return (
      <p>
        <Loading />
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  if (!productData) return <p>Product not found</p>;

  const handleUpdatePrice = (amount: number) => {
    setFinalPrice((prevPrice) => prevPrice + amount);
  };

  const handleOrder = () => {
    if (!session || !session.user) {
      {
        toast.custom(
          <ToastContent type="error" message={t("rent.PleaseLogin")} />
        );
      }
      return;
    }

    if (productData) {
      createOrderMutation.mutate({
        productName: productData.name,
        productId: productData.id,
        finalPrice: finalPrice,
        nights: finalNightsAmount,
        controllers: +finalControllerAmount,
        installation: isInstallationChecked,
        packageId: selectedPackageId,
        userId: +session.user?.id ?? 0,
        username: session.user?.username ?? "Unknown",
        userEmail: session.user.email ?? "Unknown",
      });
    }
    setOpen(false);
  };
  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <DeviceCard product={product} />
      {productData && (
        <div>
          <div
            className={`flex justify-between relative py-3 px-6 md:px-12 rounded-full
       shadow-2xl text-center my-6
     bg-white bg-opacity-10 border-2 border-transparent border-purple-900`}
          >
            <h1 className=" font-PeydaBold text-lg">{t("rent.price")}</h1>
            <h1 className=" font-PeydaBold text-2xl">
              {productData.initialPrice}
            </h1>
            <h1 className=" font-PeydaBold ">تومان</h1>
          </div>
          <OrderDetails
            type="counter"
            text={t("rent.controllerCount")}
            amount={productData.everyController}
            onUpdatePrice={handleUpdatePrice}
            quantity={finalControllerAmount}
            onUpdateQuantity={setFinalControllerAmount}
          />
          <OrderDetails
            type="counter"
            text={t("rent.nightCount")}
            amount={productData.everyNight}
            onUpdatePrice={handleUpdatePrice}
            quantity={finalNightsAmount}
            onUpdateQuantity={setFinalNightsAmount}
          />
          <OrderDetails
            type="checkbox"
            text={t("rent.shippingAndInstallation")}
            isChecked={isInstallationChecked}
            onCheckboxChange={handleInstallationChange}
          />
          <OrderDetails
            type="select"
            text={t("rent.gamePackage")}
            data={productData?.packages}
            onSelectPackage={handlePackageSelect}
          />
        </div>
      )}

      <CustomButton
        onClick={() => setOpen(true)}
        title={t("rent.order")}
        type="primary-btn"
      ></CustomButton>
      <CustomModal type="general" show={open} onClose={closeModal}>
        <h1>roles</h1>
        <label>
          <input
            type="checkbox"
            checked={isRulesChecked}
            onChange={handleRulesChange}
            className="hidden"
          />
          <span
            className={`w-6 h-6 border-2 rounded-md flex items-center justify-center transition-colors duration-200 
              ${
                isRulesChecked
                  ? "bg-blue-800 border-blue-500"
                  : "bg-white border-gray-400"
              }`}
          >
            {isRulesChecked && (
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
        <CustomButton
          onClick={handleOrder}
          title={t("rent.order")}
          type="primary-btn"
          loading={createOrderMutation.isLoading}
        ></CustomButton>
      </CustomModal>
    </div>
  );
}

export default SinglePage;
