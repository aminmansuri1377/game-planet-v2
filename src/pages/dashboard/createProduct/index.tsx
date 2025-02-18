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

type CategoryInput = {
  name: string;
};
type GuarantyInput = {
  text: string;
};

export default function CategoryManagementPage() {
  const router = useRouter();
  const { data: session } = useSession();

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
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

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

    createCategory.mutate(data);
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
