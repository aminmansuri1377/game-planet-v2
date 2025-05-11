// pages/admin/categories.tsx
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import CustomButton from "../../../components/ui/CustomButton";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "../../../components/ui/ToastContent";
import { FaArrowLeftLong, FaTrash } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useCallback, useState } from "react";
import Image from "next/image";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { GetServerSidePropsContext } from "next";

type CategoryInput = {
  name: string;
};
type GuarantyInput = {
  text: string;
};
interface CategoryManagementPageProps {
  session: Session;
}
export default function CategoryManagementPage() {
  //   {
  //   session,
  // }: CategoryManagementPageProps
  const router = useRouter();
  const { data: session } = useSession();
  const [iconPreview, setIconPreview] = useState<string | null>(null);

  // Forms
  const { register, handleSubmit, reset } = useForm<CategoryInput>();
  const {
    register: GuarantyRegister,
    handleSubmit: GuarantyHandel,
    reset: GuarantyReset,
  } = useForm<GuarantyInput>();
  console.log("session", session);
  // Queries
  const { data: categories, refetch: refetchCategories } =
    trpc.main.getCategories.useQuery();
  const { data: guarantees, refetch: refetchGuarantees } =
    trpc.main.getGuaranty.useQuery();

  // Mutations
  const { t } = useTranslation();
  const createCategory = trpc.main.createCategory.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="دسته بندی با موفقیت ایجاد شد!" />
      );
      reset();
      setIconPreview(null);
      refetchCategories();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const deleteCategory = trpc.main.deleteCategory.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="دسته بندی با موفقیت ایجاد شد!" />
      );
      refetchCategories();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const createGuaranty = trpc.main.createGuaranty.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="ضمانت با موفقیت ایجاد شد!" />
      );
      GuarantyReset();
      refetchGuarantees();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const deleteGuaranty = trpc.main.deleteGuaranty.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="ضمانت با موفقیت ایجاد شد!" />
      );
      refetchGuarantees();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const handleIconUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

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

  const handleDeleteCategory = (id: number) => {
    if (confirm("Are you sure you want to delete this category?")) {
      deleteCategory.mutate({ id });
    }
  };

  const handleDeleteGuaranty = (id: number) => {
    if (confirm("Are you sure you want to delete this guarantee?")) {
      deleteGuaranty.mutate({ id });
    }
  };

  return (
    <div className="p-4">
      <div onClick={() => router.back()} className="cursor-pointer mb-4 m-5">
        <FaArrowLeftLong />
      </div>

      {/* Create Category Form */}
      <div className="bg-cardbg p-4 rounded-lg shadow mb-8">
        <h2 className="font-PeydaBold text-lg mb-4">ساخت دسته بندی</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            className="border border-gray-300 text-black rounded-lg py-3 px-4 w-full text-end font-PeydaBold text-sm"
            type="text"
            placeholder="نام دسته بندی"
            {...register("name", { required: true })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آیکن دسته بندی (SVG)
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
                <p className="text-sm font-medium text-gray-700 mb-2">
                  پیش نمایش:
                </p>
                <Image
                  src={iconPreview}
                  alt="Category Icon Preview"
                  className="w-16 h-16 object-contain"
                  width={64}
                  height={64}
                />
              </div>
            )}
          </div>

          <CustomButton
            title="ساخت دسته بندی"
            type="primary-btn"
            loading={createCategory.isLoading}
          />
        </form>
      </div>

      {/* Create Guarantee Form */}
      <div className="bg-cardbg p-4 rounded-lg shadow mb-8">
        <h2 className="font-PeydaBold text-lg mb-4">ساخت ضمانت</h2>
        <form onSubmit={GuarantyHandel(onSubmitGuaranty)} className="space-y-4">
          <input
            className="border border-gray-300 text-black rounded-lg py-3 px-4 w-full text-end font-PeydaBold text-sm"
            type="text"
            placeholder="ضمانت"
            {...GuarantyRegister("text", { required: true })}
          />

          <CustomButton
            title="ساخت ضمانت"
            type="primary-btn"
            loading={createGuaranty.isLoading}
          />
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-cardbg p-4 rounded-lg shadow mb-8">
        <h2 className="font-PeydaBold text-lg mb-4">دسته بندی ها</h2>
        {categories?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div
                key={category.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div className="flex items-center">
                  {category.icon && (
                    <div className="w-8 h-8 mr-3">
                      <Image
                        src={category.icon}
                        alt={category.name}
                        className="w-full h-full object-contain"
                        width={32}
                        height={32}
                      />
                    </div>
                  )}
                  <span className="font-PeydaBold">{category.name}</span>
                </div>
                {/* <button
                  onClick={() => handleDeleteCategory(category.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">دسته بندی پیدا نشد</p>
        )}
      </div>

      {/* Guarantees List */}
      <div className="bg-cardbg p-4 rounded-lg shadow">
        <h2 className="font-PeydaBold text-lg mb-4">ضمانت ها</h2>
        {guarantees?.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {guarantees.map((guarantee) => (
              <div
                key={guarantee.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <span className="font-PeydaBold">{guarantee.text}</span>
                {/* <button
                  onClick={() => handleDeleteGuaranty(guarantee.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <FaTrash />
                </button> */}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">ضمانتی پیدا نشدس</p>
        )}
      </div>
    </div>
  );
}

// export async function getServerSideProps(context: GetServerSidePropsContext) {
//   const session = await getServerSession(context.req, context.res, authOptions);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   // Clean the session object by replacing undefined with null
//   const cleanedSession = JSON.parse(
//     JSON.stringify(session, (key, value) =>
//       value === undefined ? null : value
//     )
//   );

//   return {
//     props: {
//       session: cleanedSession,
//     },
//   };
// }
