import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import { MdDeleteForever } from "react-icons/md";
import CustomButton from "@/components/ui/CustomButton";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "@/components/ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";

type PackageInput = {
  name: string;
  price: number;
  inventory: number;
};

type ProductInput = {
  name: string;
  info: string;
  initialPrice: number;
  everyNight: number;
  everyController: number;
  installation: number;
  packages: PackageInput[];
};

export default function CreateProductForm() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { register, handleSubmit, control, reset } = useForm<ProductInput>({
    defaultValues: {
      packages: [{ name: "", price: 0 }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });
  const { t } = useTranslation();
  const createProduct = trpc.main.createProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Order created successfully!" />
      ); //   refetch();
      reset();
    },
    onError: (err) => {
      {
        toast.custom(<ToastContent type="error" message={err?.message} />);
      }
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = (data) => {
    createProduct.mutate(data);
  };
  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className=" mx-auto text-center">
        <h2 className=" font-PeydaBold text-lg">{t("rent.productCreation")}</h2>
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.productName")}
          {...register("name", { required: true })}
        />

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.description")}
          {...register("info")}
        />
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.initialPrice")}
          {...register("initialPrice", { valueAsNumber: true })}
        />
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.nightPrice")}
          {...register("everyNight", { valueAsNumber: true })}
        />
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.controllerPrice")}
          {...register("everyController", { valueAsNumber: true })}
        />
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.shippingAndInstallationPrice")}
          {...register("installation", { valueAsNumber: true })}
        />

        <h3 className=" text-end font-PeydaBold text-sm">:پکیج ها</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="text"
              placeholder={t("rent.packageName")}
              {...register(`packages.${index}.name`, { required: true })}
            />
            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="number"
              placeholder={t("rent.packagePrice")}
              {...register(`packages.${index}.price`, { valueAsNumber: true })}
            />
            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="number"
              placeholder={t("rent.packageInventory")}
              {...register(`packages.${index}.inventory`, {
                valueAsNumber: true,
              })}
            />
            <MdDeleteForever onClick={() => remove(index)} size={40} />
            {/* <h6 className=" font-PeydaThin text-sm">حذف</h6> */}
          </div>
        ))}

        <CustomButton
          onClick={() => append({ name: "", price: 0 })}
          type="primary-btn"
          title={t("rent.addPackage")}
        ></CustomButton>
        <div></div>
        <CustomButton
          title={t("rent.create")}
          type="primary-btn"
          loading={createProduct.isLoading}
        ></CustomButton>
      </form>
    </div>
  );
}
