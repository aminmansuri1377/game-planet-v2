// pages/admin/categories.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import CustomButton from "../../../components/ui/CustomButton";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "../../../components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import Image from "next/image";

type CategoryInput = {
  name: string;
};
type GuarantyInput = {
  text: string;
};

export default function CategoryManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  const { register, handleSubmit, reset } = useForm<CategoryInput>();
  const {
    register: GuarantyRegister,
    handleSubmit: GuarantyHandel,
    reset: GuarantyReset,
  } = useForm<GuarantyInput>();

  const { t } = useTranslation();
  const createCategory = trpc.main.createCategory.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Category created successfully!" />
      );
      reset();
      setIconPreview(null);
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const handleIconUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // Validate it's an SVG file
      if (!file.name.endsWith(".svg")) {
        toast.custom(
          <ToastContent type="error" message="Only SVG files are allowed" />
        );
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setIconPreview(result);
      };
      reader.readAsDataURL(file);
    },
    []
  );

  const onSubmit: SubmitHandler<CategoryInput> = (data) => {
    if (!session?.user?.id) {
      toast.custom(
        <ToastContent
          type="error"
          message="You must be logged in to create a category."
        />
      );
      return;
    }

    createCategory.mutate({
      name: data.name,
      icon: iconPreview || undefined,
    });
  };
  const createGuaranty = trpc.main.createGuaranty.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Guaranty created successfully!" />
      );
      GuarantyReset();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const onSubmitGuaranty: SubmitHandler<GuarantyInput> = (data) => {
    if (!session?.user?.id) {
      toast.custom(
        <ToastContent
          type="error"
          message="You must be logged in to create a Guaranty."
        />
      );
      return;
    }

    createGuaranty.mutate(data);
  };

  return (
    <div>
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto text-center">
        <h2 className="font-PeydaBold text-lg">Create Category</h2>

        {/* Category Name */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder="Category Name"
          {...register("name", { required: true })}
        />
        <div className="my-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category Icon (SVG)
          </label>
          <input
            type="file"
            accept=".svg"
            onChange={handleIconUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          {iconPreview && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
              <Image
                src={iconPreview}
                alt="1/"
                className="w-full h-full object-contain"
                width={20}
                height={20}
              />
            </div>
          )}
        </div>
        {/* Submit Button */}
        <CustomButton
          title="Create Category"
          type="primary-btn"
          loading={createCategory.isLoading}
        />
      </form>
      <form
        onSubmit={GuarantyHandel(onSubmitGuaranty)}
        className="mx-auto text-center"
      >
        <h2 className="font-PeydaBold text-lg">Create guaranty</h2>

        {/* Category Name */}
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder="guaranty Name"
          {...GuarantyRegister("text", { required: true })}
        />

        {/* Submit Button */}
        <CustomButton
          title="Create Category"
          type="primary-btn"
          loading={createGuaranty.isLoading}
        />
      </form>
    </div>
  );
}
