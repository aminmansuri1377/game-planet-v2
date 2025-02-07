import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import CustomButton from "@/components/ui/CustomButton";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory: number;
  sendingType: ("SELLER_SENDS" | "BUYER_PICKS_UP")[];
};

export default function CreateProductForm() {
  const router = useRouter();
  const { data: session } = useSession(); // Get the authenticated user's session
  const handleBack = () => {
    router.back();
  };
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ProductInput>({
      defaultValues: {
        sendingType: [], // Initialize sendingType as an empty array
      },
    });

  const { t } = useTranslation();
  const createProduct = trpc.main.createProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Product created successfully!" />
      );
      reset();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = (data) => {
    if (!session?.user?.id) {
      toast.custom(
        <ToastContent
          type="error"
          message="You must be logged in to create a product."
        />
      );
      return;
    }

    // Include sellerId in the mutation input
    createProduct.mutate({
      ...data,
      sellerId: session.user.id, // Pass the authenticated user's ID as sellerId
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

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto text-center">
        <h2 className="font-PeydaBold text-lg">{t("rent.productCreation")}</h2>

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
                checked={watch("sendingType").includes("SELLER_SENDS")}
                onChange={() => handleSendingTypeChange("SELLER_SENDS")}
                className="form-checkbox"
              />
              <span>{t("rent.sellerSends")}</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={watch("sendingType").includes("BUYER_PICKS_UP")}
                onChange={() => handleSendingTypeChange("BUYER_PICKS_UP")}
                className="form-checkbox"
              />
              <span>{t("rent.buyerPicksUp")}</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <CustomButton
          title={t("rent.create")}
          type="primary-btn"
          loading={createProduct.isLoading}
        />
      </form>
    </div>
  );
}
