import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../../utils/trpc";
import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import Loading from "@/components/ui/Loading";
import CustomButton from "@/components/ui/CustomButton";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory: number;
  sendingType: ("SELLER_SENDS" | "BUYER_PICKS_UP")[];
};

export default function UpdateProductForm() {
  const router = useRouter();
  const { id } = router.query; // Get the product ID from the URL
  const { data: session } = useSession(); // Get the authenticated user's session
  const handleBack = () => {
    router.back();
  };
  const { t } = useTranslation();

  const { register, handleSubmit, reset, setValue, watch } =
    useForm<ProductInput>();

  const {
    data: product,
    isLoading,
    error,
  } = trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });

  const updateProduct = trpc.main.updateProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Product updated successfully!" />
      );
      router.push("/seller/products");
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err.message} />);
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = (data) => {
    updateProduct.mutate({
      productId: Number(id),
      sellerId: session?.user?.id as number, // Ensure only the seller can update their own product
      ...data,
    });
  };

  // Handle sendingType selection
  const handleSendingTypeChange = (type: "SELLER_SENDS" | "BUYER_PICKS_UP") => {
    const currentTypes = watch("sendingType");
    if (currentTypes.includes(type)) {
      setValue(
        "sendingType",
        currentTypes.filter((t) => t !== type)
      );
    } else {
      setValue("sendingType", [...currentTypes, type]);
    }
  };

  useEffect(() => {
    if (product) {
      reset(product); // Populate the form with the product data
    }
  }, [product, reset]);

  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!product) return <p>Product not found</p>;

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto text-center">
        <h2 className="font-PeydaBold text-lg">{t("rent.editProduct")}</h2>

        {/* Product Name */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.productName")}
          {...register("name", { required: true })}
        />

        {/* Product Description */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.description")}
          {...register("description", { required: true })}
        />

        {/* Product Price */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.price")}
          {...register("price", { required: true, valueAsNumber: true })}
        />

        {/* Product Inventory */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.inventory")}
          {...register("inventory", { required: true, valueAsNumber: true })}
        />

        {/* Sending Type */}
        <div className="w-4/5 mx-auto my-2 text-end">
          <label className="block font-PeydaBold text-sm mb-2">
            {t("rent.sendingType")}
          </label>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watch("sendingType")?.includes("SELLER_SENDS")}
                onChange={() => handleSendingTypeChange("SELLER_SENDS")}
                className="form-checkbox"
              />
              <span>{t("rent.sellerSends")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watch("sendingType")?.includes("BUYER_PICKS_UP")}
                onChange={() => handleSendingTypeChange("BUYER_PICKS_UP")}
                className="form-checkbox"
              />
              <span>{t("rent.buyerPicksUp")}</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <CustomButton
          type="primary-btn"
          title={t("rent.update")}
          loading={updateProduct.isLoading}
        />
      </form>
    </div>
  );
}
