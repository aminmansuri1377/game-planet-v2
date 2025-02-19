// pages/seller/createProduct.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import CustomButton from "@/components/ui/CustomButton";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { uploadImage } from "../../../../utils/uploadImage";

type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory: number;
  sendingType: ("SELLER_SENDS" | "BUYER_PICKS_UP")[];
  categoryId: number;
  guarantyId: number;
  images?: FileList; // Make images optional
};

export default function CreateProductForm() {
  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [isUploading, setIsUploading] = useState(false);
  const [guaranty, setGuaranty] = useState<{ id: number; text: string }[]>([]);

  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ProductInput>({
      defaultValues: {
        sendingType: [],
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

  const { data: categoryData } = trpc.main.getCategories.useQuery();
  const { data: guarantyData } = trpc.main.getGuaranty.useQuery();

  useEffect(() => {
    if (categoryData) {
      setCategories(categoryData);
    }
    if (guarantyData) {
      setGuaranty(guarantyData);
    }
  }, [categoryData, guarantyData]);

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (!session?.user?.id) {
      toast.custom(
        <ToastContent
          type="error"
          message="You must be logged in to create a product."
        />
      );
      return;
    }

    setIsUploading(true);

    try {
      let imageUrls: string[] = [];

      // Upload images if they exist
      if (data.images && data.images.length > 0) {
        imageUrls = await Promise.all(
          Array.from(data.images).map(async (file) => {
            return await uploadImage(file);
          })
        );
      }

      // Create the product with or without image URLs
      createProduct.mutate({
        ...data,
        sellerId: session.user.id,
        images: imageUrls, // Pass image URLs (empty array if no images)
      });
    } catch (error) {
      toast.custom(
        <ToastContent type="error" message="Failed to upload images." />
      );
    } finally {
      setIsUploading(false);
    }
  };

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
      <div onClick={() => router.back()}>
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

        {/* Category Selection */}
        <select
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          {...register("categoryId", { required: true, valueAsNumber: true })}
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        {/* Guaranty Selection */}
        <select
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          {...register("guarantyId", { required: true, valueAsNumber: true })}
        >
          <option value="">Select a guaranty</option>
          {guaranty.map((guaranty) => (
            <option key={guaranty.id} value={guaranty.id}>
              {guaranty.text}
            </option>
          ))}
        </select>

        {/* Image Upload (Optional) */}
        <div className="w-4/5 mx-auto my-2 text-end">
          <label className="block font-PeydaBold text-sm mb-2">
            {t("rent.productImages")} (Optional)
          </label>
          <input
            type="file"
            multiple
            {...register("images")} // Make images optional
            className="border border-gray-600 rounded-lg py-2 px-4 w-full"
          />
        </div>

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
          loading={createProduct.isLoading || isUploading}
        />
      </form>
    </div>
  );
}
