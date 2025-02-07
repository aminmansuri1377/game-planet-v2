import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../utils/trpc";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDeleteForever } from "react-icons/md";
import { useRouter } from "next/router";
import Loading from "@/components/ui/Loading";
import CustomButton from "@/components/ui/CustomButton";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect";
import CustomModal from "@/components/ui/CustomModal";
import ToastContent from "@/components/ui/ToastContent";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";

type PackageInput = {
  id?: string;
  name: string;
  price: number;
  inventory: number;
};

type ProductInput = {
  name?: string;
  info?: string;
  initialPrice?: number;
  everyNight?: number;
  everyController?: number;
  installation?: number;
  packages?: PackageInput[];
};

export default function UpdateProductForm() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { t } = useTranslation();
  const { product } = router.query;
  const { register, handleSubmit, control, reset, setValue } =
    useForm<ProductInput>({
      defaultValues: { packages: [] },
    });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "packages",
  });

  const {
    data: productData,
    isLoading,
    error,
  } = trpc.main.getProductByName.useQuery(
    { name: product as string },
    { enabled: !!product }
  );
  const deletePackageMutation = trpc.main.deletePackage.useMutation({
    onSuccess: () => {
      toast.success("Package deleted successfully!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  useEffect(() => {
    if (productData) {
      reset(productData);
      productData.packages.forEach((pkg, index) => {
        setValue(`packages.${index}.id`, pkg.id);
      });
    }
  }, [productData, reset, setValue]);

  const updateProduct = trpc.main.updateProduct.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Order created successfully!" />
      );
    },
    onError: (err) => {
      {
        toast.custom(<ToastContent type="error" message={err?.message} />);
      }
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = (data) => {
    const parsedData = {
      ...data,
      initialPrice: parseFloat(data.initialPrice) || 0,
      everyNight: parseFloat(data.everyNight) || 0,
      everyController: parseFloat(data.everyController) || 0,
      installation: parseFloat(data.installation) || 0,
      packages: data.packages?.map((pkg) => ({
        ...pkg,
        price: parseFloat(pkg.price) || 0,
        inventory: parseFloat(pkg.inventory) || 0,
      })),
    };
    updateProduct.mutate(parsedData);
    router.reload();
    // console.log("parsedData", parsedData);
  };

  useEffect(() => {
    if (productData) {
      reset(productData);
      productData.packages.forEach((pkg, index) => {
        setValue(`packages.${index}.id`, Number(pkg.id));
        setValue(`packages.${index}.name`, pkg.name);
        setValue(`packages.${index}.price`, pkg.price);
        setValue(`packages.${index}.inventory`, pkg.inventory);
      });
    }
  }, [productData, reset, setValue]);

  const handleDelete = (index: number) => {
    remove(index);
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(
    null
  );

  // const handleOpenModal = (id) => {
  //   console.log("Attempting to set selectedPackageId with:", id);
  //   setSelectedPackageId(id);
  //   console.log("selectedPackageId after set:", selectedPackageId);
  //   setIsModalOpen(true);
  // };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPackageId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedPackageId !== null) {
      deletePackageMutation.mutate({ id: selectedPackageId });
      setIsModalOpen(false);
    }
  };

  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }
  if (isLoading)
    return (
      <p>
        <Loading />
      </p>
    );
  if (error) return <p>Error: {error.message}</p>;

  if (!productData) return <p>productData not found</p>;
  // console.log("selectedPackageId", selectedPackageId);
  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto text-center">
        <h2 className="font-PeydaBold text-lg">{t("rent.editProduct")}</h2>
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.name + `:${t("rent.previousAmount")}`}
        </h3>
        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.productName")}
          {...register("name")}
        />
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.info + `:${t("rent.previousAmount")}`}
        </h3>

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="text"
          placeholder={t("rent.description")}
          {...register("info")}
        />
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.initialPrice + `:${t("rent.previousAmount")}`}
        </h3>

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.initialPrice")}
          {...register("initialPrice", { valueAsNumber: true })}
        />
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.everyNight + `:${t("rent.previousAmount")}`}
        </h3>

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.nightPrice")}
          {...register("everyNight", { valueAsNumber: true })}
        />
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.everyController + `:${t("rent.previousAmount")}`}
        </h3>

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.controllerPrice")}
          {...register("everyController", { valueAsNumber: true })}
        />
        <h3 className=" font-PeydaThin mt-5 text-sm text-end">
          {productData?.installation + `:${t("rent.previousAmount")}`}
        </h3>

        <input
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="number"
          placeholder={t("rent.shippingAndInstallationPrice")}
          {...register("installation", { valueAsNumber: true })}
        />

        <h3 className="font-PeydaBold text-sm">{t("rent.packages")}</h3>
        {fields.map((field, index) => (
          <div key={field.id}>
            <h3 className=" font-PeydaThin mt-5 text-sm text-end">
              {field.name + `:${t("rent.previousAmount")}`}
            </h3>

            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="text"
              placeholder={t("rent.packageName")}
              {...register(`packages.${index}.name`)}
            />
            <h3 className=" font-PeydaThin mt-5 text-sm text-end">
              {field.price + `:${t("rent.previousAmount")}`}
            </h3>

            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="number"
              placeholder={t("rent.packagePrice")}
              {...register(`packages.${index}.price`, { valueAsNumber: true })}
            />
            <h3 className=" font-PeydaThin mt-5 text-sm text-end">
              {field.inventory + `:${t("rent.previousAmount")}`}
            </h3>

            <input
              className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              type="number"
              placeholder={t("rent.packageInventory")}
              {...register(`packages.${index}.inventory`, {
                valueAsNumber: true,
              })}
            />
            {/* <button type="button" onClick={() => handleOpenModal(field.id)}>
              <MdDeleteForever />
            </button> */}
            {/* {field.id ? (
            <MdDeleteForever
            onClick={() => handleOpenModal(field.id ?? null)}
            size={40}
            />
            ) : (
              <MdDeleteForever onClick={() => handleDelete(index)} size={40} />
              )} */}
            {/* <h6 className="font-PeydaThin text-end text-sm">حذف</h6> */}
          </div>
        ))}

        {/* <CustomButton
        type="primary-btn"
        onClick={() => append({ name: "", price: 0, inventory: 0 })}
        title="اضافه کردن پکیج"
        loading={updateProduct.isLoading}
        ></CustomButton> */}

        <CustomButton type="primary-btn" title={t("rent.edit")}></CustomButton>
        <CustomModal show={isModalOpen} type="alert" onClose={handleCloseModal}>
          <p>آیا مطمئن هستید که می‌خواهید این پکیج را حذف کنید؟</p>
          <CustomButton
            onClick={handleConfirmDelete}
            title="تأیید"
            type="primary-btn"
          />
          <CustomButton
            onClick={handleCloseModal}
            title="لغو"
            type="primary-btn"
          />
        </CustomModal>
      </form>
    </div>
  );
}
