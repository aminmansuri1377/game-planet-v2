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
import jalaali from "jalaali-js";
import { useRecoilState } from "recoil";
import { buyerLocationAtom } from "../../../store/atoms/buyerLocationAtom";
import Header from "@/components/Header";
import { WithRole } from "@/components/auth/WithRole";
import { isProfileComplete } from "../../../utils/checkProfileCompletion";
import CommentsSection from "@/components/ui/CommentsSection";
import { ProductDetails } from "@/components/ProductDetails";
import { OrderModal } from "@/components/OrderModal";
import { ProfileIncomplete } from "@/components/ProfileIncomplete";
import SimilarProducts from "@/components/ui/SimilarProducts";

function SingleProductPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { id } = router.query;
  const { data: session, status } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const utils = trpc.useUtils();

  // State management
  const [finalAmount, setFinalAmount] = useState<number>(1);
  const [address, setAddress] = useState("");
  const [buyerLocation, setBuyerLocation] = useRecoilState(buyerLocationAtom);
  const [open, setOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [selectedSendingType, setSelectedSendingType] = useState<
    "SELLER_SENDS" | "BUYER_PICKS_UP" | null
  >(null);

  // Data fetching
  const { data: buyer, isLoading: isSellerLoading } =
    trpc.main.getBuyerById.useQuery({ userId: userId! }, { enabled: !!userId });

  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });
  const { data: similarProducts } = trpc.main.getSimilarProducts.useQuery(
    {
      categoryId: productData?.categoryId || 0,
      city: productData?.city || undefined,
      excludeProductId: Number(id) || 0,
      limit: 4,
    },
    { enabled: !!productData && !!id }
  );
  const { data: savedProducts } = trpc.main.getSavedProducts.useQuery(
    {
      buyerId: userId,
    },
    {
      enabled: !!userId, // Only fetch if buyerId is available
    }
  );
  const saveProductMutation = trpc.main.saveProduct.useMutation({
    onSuccess: () => {
      toast.success("محصول ذخیره شد!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  console.log("useridd", userId);
  const unsaveProductMutation = trpc.main.unsaveProduct.useMutation({
    onSuccess: () => {
      toast.success("محصول از ذخیره ها حذف شد!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleSave = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!userId) return;

    const isSaved = savedProducts?.some((sp) => sp.productId === productId);

    // Optimistic update
    utils.main.getSavedProducts.setData({ userId }, (old) => {
      if (!old) return old;
      return isSaved
        ? old.filter((sp) => sp.productId !== productId)
        : [
            ...old,
            {
              userId,
              productId,
              product: similarProducts?.find((p) => p.id === productId),
            },
          ];
    });

    try {
      if (isSaved) {
        await unsaveProductMutation.mutateAsync({ buyerId: userId, productId });
      } else {
        await saveProductMutation.mutateAsync({ buyerId: userId, productId });
      }
    } catch (err) {
      // Revert if error
      utils.main.getSavedProducts.invalidate({ buyerId: userId });
      console.error(err);
    }
  };
  // Mutations
  const createOrderMutation = trpc.main.createOrder.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="سفارش با موفقیت ثبت شد!" />
      );
      setBuyerLocation(null);
      router.push("/");
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const createChatMutation = trpc.main.createChatRoom.useMutation({
    onSuccess: (data) => {
      router.push(`/chat?roomId=${data.id}`);
    },
    onError: () => {
      toast.custom(
        <ToastContent type="error" message="Failed to create chat room" />
      );
    },
  });

  // Helper functions
  const persianToEnglishNumbers = (str: string) => {
    return str?.replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d).toString());
  };

  const convertToDate = (persianDate: string): Date => {
    if (!persianDate || typeof persianDate !== "string") {
      throw new Error(
        "Invalid Persian date: Date is undefined or not a string"
      );
    }

    const englishDate = persianToEnglishNumbers(persianDate);
    const parts = englishDate.split("-");

    if (!parts || parts.length !== 3) {
      throw new Error(
        "Invalid Persian date format: Expected format is YYYY-MM-DD"
      );
    }

    const [jy, jm, jd] = parts.map(Number);
    const { gy, gm, gd } = jalaali.toGregorian(jy, jm, jd);
    return new Date(gy, gm - 1, gd);
  };

  const calculateTotalPrice = (
    startDate: Date,
    endDate: Date,
    price: number,
    quantity: number
  ): number => {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return nights * price * quantity;
  };

  // Handlers
  const handleStartChat = () => {
    if (!session || !session.user) {
      toast.custom(
        <ToastContent type="error" message={t("rent.PleaseLogin")} />
      );
      return;
    }

    if (!productData) return;

    createChatMutation.mutate({
      userType1: "BUYER",
      userId1: userId!,
      userType2: "SELLER",
      userId2: productData.sellerId,
    });
  };

  const closeModal = () => {
    setStartDate(null);
    setEndDate(null);
    setTotalPrice(0);
    setFinalAmount(1);
    setOpen(false);
  };

  const handleOrder = () => {
    if (!session || !session.user) {
      toast.custom(
        <ToastContent type="error" message={t("rent.PleaseLogin")} />
      );
      return;
    }

    if (!buyerLocation) {
      toast.custom(
        <ToastContent type="error" message="لطفا لوکیشن خو را وارد کنید." />
      );
      return;
    }

    if (!productData || !startDate || !endDate || !totalPrice) return;

    const sendingType =
      productData.sendingType.length === 1
        ? productData.sendingType[0]
        : selectedSendingType;

    try {
      const startDateObj = convertToDate(startDate);
      const endDateObj = convertToDate(endDate);

      createOrderMutation.mutate({
        productId: productData.id,
        userId: userId!,
        sellerId: productData.sellerId,
        status: "waiting for confirmation",
        sendingType: sendingType!,
        startDate: startDateObj.toISOString(),
        endDate: endDateObj.toISOString(),
        totalPrice: totalPrice,
        latitude: buyerLocation.latitude,
        longitude: buyerLocation.longitude,
        quantity: finalAmount,
        address: address,
      });
    } catch (error) {
      toast.custom(
        <ToastContent
          type="error"
          message="Invalid date format or calculation."
        />
      );
    }
  };

  // Effects
  useEffect(() => {
    if (productData && startDate && endDate) {
      try {
        const startDateObj = convertToDate(startDate);
        const endDateObj = convertToDate(endDate);

        const totalPrice = calculateTotalPrice(
          startDateObj,
          endDateObj,
          productData.price,
          finalAmount
        );
        setTotalPrice(totalPrice);
      } catch (error) {
        setTotalPrice(null);
      }
    }
  }, [startDate, endDate, finalAmount, productData]);

  // Render logic
  if (error) return <p>Error: {error.message}</p>;

  if (!isProfileComplete(buyer)) {
    return (
      <ProfileIncomplete
        onBack={() => router.back()}
        onCompleteProfile={() => router.push("/profile/CompleteProfile")}
      />
    );
  }

  return (
    <WithRole allowedRoles={["buyer"]}>
      <div>
        <div className="px-5">
          <Header />

          {!productData ? (
            <p>Product not found</p>
          ) : (
            <>
              {isLoading ? (
                <Loading />
              ) : (
                <ProductDetails
                  product={productData}
                  onBack={() => router.back()}
                  onStartChat={handleStartChat}
                />
              )}
            </>
          )}

          <CustomButton
            onClick={() => setOpen(true)}
            title={t("rent.order")}
            type="primary-btn"
          />

          {productData && (
            <OrderModal
              isOpen={open}
              onClose={closeModal}
              onOrder={handleOrder}
              product={productData}
              totalPrice={totalPrice}
              setTotalPrice={setTotalPrice}
              finalAmount={finalAmount}
              setFinalAmount={setFinalAmount}
              startDate={startDate}
              setStartDate={setStartDate}
              endDate={endDate}
              setEndDate={setEndDate}
              selectedSendingType={selectedSendingType}
              setSelectedSendingType={setSelectedSendingType}
              address={address}
              setAddress={setAddress}
              isLoading={createOrderMutation.isLoading}
            />
          )}
        </div>

        <div className="">
          {productData && userId && (
            <CommentsSection productId={productData.id} buyerId={userId} />
          )}
        </div>
        {similarProducts && similarProducts.length > 0 && (
          <SimilarProducts
            products={similarProducts}
            onProductClick={(id) => router.push(`/singleProduct?id=${id}`)}
            onSave={handleSave}
          />
        )}
      </div>
    </WithRole>
  );
}
//export const dynamic = "force-dynamic";

export default SingleProductPage;
