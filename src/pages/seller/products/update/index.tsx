import { useRouter } from "next/router";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "../../../../../utils/trpc";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import Uploader from "@/components/uploader/Uploader";
import CustomButton from "@/components/ui/CustomButton";
import { FaArrowLeftLong } from "react-icons/fa6";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { FiEdit } from "react-icons/fi";
import { WithRole } from "@/components/auth/WithRole";
import Loading from "@/components/ui/Loading";

const Map = Dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});

type ProductInput = {
  name: string;
  description: string;
  price: number;
  inventory: number;
  sendingType: ("SELLER_SENDS" | "BUYER_PICKS_UP")[];
  categoryId: number;
  guarantyId: number;
  images?: string[];
  latitude?: number;
  longitude?: number;
  city?: string;
  address?: string;
};

function UpdateProductForm() {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [filteredCities, setFilteredCities] = useState<
    { id: number; name: string }[]
  >([]);
  const [cityQuery, setCityQuery] = useState("");

  // Fetch product data
  const { data: product, isLoading: isProductLoading } =
    trpc.main.getProductById.useQuery({ id: Number(id) }, { enabled: !!id });

  // Fetch categories and guaranties
  const { data: categoryData } = trpc.main.getCategories.useQuery();
  const { data: guarantyData } = trpc.main.getGuaranty.useQuery();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { isDirty },
  } = useForm<ProductInput>();

  // Initialize form with product data
  useEffect(() => {
    if (product) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        inventory: product.inventory,
        sendingType: product.sendingType,
        categoryId: product.categoryId || 0,
        guarantyId: product.guarantyId || 0,
        latitude: product.latitude || undefined,
        longitude: product.longitude || undefined,
        city: product.city || "",
        address: product.address || "",
        images: product.images ? (product.images as string[]) : [],
      });

      if (product.images) {
        setImageUrls(product.images as string[]);
      }

      if (product.latitude && product.longitude) {
        setCoordinates([product.latitude, product.longitude]);
        setPosition([product.latitude, product.longitude]);
      }

      if (product.city) {
        setCityQuery(product.city);
      }
    }
  }, [product, reset]);

  // Load cities data
  useEffect(() => {
    fetch("/data/iran-cities.json")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setFilteredCities(data);
      });
  }, []);

  // Filter cities based on search query
  useEffect(() => {
    if (cityQuery) {
      const filtered = cities.filter((city) =>
        city.name.toLowerCase().includes(cityQuery.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [cityQuery, cities]);

  const handleCitySearch = (query: string) => {
    setCityQuery(query);
  };

  const handleCitySelect = (cityName: string) => {
    setValue("city", cityName, { shouldDirty: true });
    setCityQuery(cityName);
    setFilteredCities([]);
  };

  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
    setValue("latitude", coords[0], { shouldDirty: true });
    setValue("longitude", coords[1], { shouldDirty: true });
  };

  const handleSendingTypeChange = (type: "SELLER_SENDS" | "BUYER_PICKS_UP") => {
    const currentTypes = watch("sendingType");
    if (currentTypes.includes(type)) {
      setValue(
        "sendingType",
        currentTypes.filter((t) => t !== type),
        { shouldDirty: true }
      );
    } else {
      setValue("sendingType", [...currentTypes, type], { shouldDirty: true });
    }
  };

  const updateProduct = trpc.main.updateProduct.useMutation({
    onSuccess: () => {
      toast.success("محصول با موفقیت بروزرسانی شد!");
      router.push("/seller/products");
    },
    onError: (err) => {
      toast.error(err.message || "خطایی در بروزرسانی بوجود آمده");
    },
  });

  const onSubmit: SubmitHandler<ProductInput> = async (data) => {
    if (!id) return;

    // Only send changed fields to optimize performance
    const changedFields: Partial<ProductInput> = {};
    Object.keys(data).forEach((key) => {
      const field = key as keyof ProductInput;
      if (field in product && data[field] !== product[field]) {
        changedFields[field] = data[field];
      }
    });

    // Always include images if they were updated
    if (imageUrls.length > 0) {
      changedFields.images = imageUrls;
    }

    updateProduct.mutate({
      id: Number(id),
      ...changedFields,
    });
  };

  // if (isProductLoading) return <div>Loading...</div>;
  if (!product) return <div className=" font-PeydaBlack">محصول یافت نشد</div>;

  return (
    <WithRole allowedRoles={["seller"]}>
      <div>
        <HeadOfPages
          title="بروزرسانی مشخصات محصول"
          back={
            <div onClick={() => router.back()} className="m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <FiEdit size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />
        {isProductLoading ? (
          <Loading />
        ) : (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mx-auto text-center mt-8"
          >
            {/* <h1 className="font-PeydaRegular text-lg">
              Update your product information
            </h1> */}

            {/* Product Name */}
            <Input
              className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="text"
              placeholder="نام محصول"
              {...register("name", { required: true })}
            />

            {/* Product Description */}
            <Input
              className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="text"
              placeholder="توضیحات"
              {...register("description", { required: true })}
            />

            {/* Product Price */}
            <Input
              className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="number"
              placeholder="قیمت"
              {...register("price", { required: true, valueAsNumber: true })}
            />

            {/* Product Inventory */}
            <Input
              className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="number"
              placeholder="موجودی"
              {...register("inventory", {
                required: true,
                valueAsNumber: true,
              })}
            />

            {/* Address */}
            <Input
              className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="text"
              placeholder="آدرس"
              {...register("address", { required: true })}
            />

            {/* Image Uploader */}
            {/* <Uploader
              onUpload={(urls) => {
                setImageUrls(urls);
                setValue("images", urls, { shouldDirty: true });
              }}
              bucket="product-images"
              initialFiles={product.images as string[] | undefined}
            /> */}

            {/* City Search */}
            <div className="w-4/5 mx-auto my-2 text-end relative mb-10">
              <label className="block font-PeydaBold text-sm mb-2">شهر</label>
              <input
                type="text"
                placeholder="جستجوی شهر"
                value={cityQuery}
                onChange={(e) => handleCitySearch(e.target.value)}
                className="py-3 px-4 w-full mx-auto my-2 text-end font-PeydaBold rounded-full bg-gradient-to-r from-gra-100 to-gra-200"
              />
              {filteredCities.length > 0 && (
                <div className="absolute bg-cardbg border border-gray-300 rounded-lg mt-1 w-full z-10 text-text1">
                  {filteredCities.map((city) => (
                    <div
                      key={city.id}
                      onClick={() => handleCitySelect(city.name)}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {city.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Category Selection */}
            <select
              className="bg-gradient-to-r from-gra-100 to-gra-200 border-2 border-primary text-black rounded-xl py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              {...register("categoryId", {
                required: true,
                valueAsNumber: true,
              })}
            >
              <option className="bg-primary" value="">
                دسته بندی
              </option>
              {categoryData?.map((category) => (
                <option
                  className="bg-primary"
                  key={category.id}
                  value={category.id}
                  selected={category.id === product.categoryId}
                >
                  {category.name}
                </option>
              ))}
            </select>

            {/* Guaranty Selection */}
            <select
              className="bg-gradient-to-r from-gra-100 to-gra-200 border-2 border-primary text-black rounded-xl py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
              {...register("guarantyId", {
                required: true,
                valueAsNumber: true,
              })}
            >
              <option className="bg-primary" value="">
                نوع ضمانت
              </option>
              {guarantyData?.map((guaranty) => (
                <option
                  className="bg-primary"
                  key={guaranty.id}
                  value={guaranty.id}
                  selected={guaranty.id === product.guarantyId}
                >
                  {guaranty.text}
                </option>
              ))}
            </select>

            {/* Sending Type */}
            <div className="w-4/5 mx-auto my-2 text-end">
              <label className="block font-PeydaBold text-sm mb-2">
                نوع ارسال
              </label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={watch("sendingType")?.includes("SELLER_SENDS")}
                    onChange={() => handleSendingTypeChange("SELLER_SENDS")}
                    className="form-checkbox"
                  />
                  <span>براش میفرستم</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={watch("sendingType")?.includes("BUYER_PICKS_UP")}
                    onChange={() => handleSendingTypeChange("BUYER_PICKS_UP")}
                    className="form-checkbox"
                  />
                  <span>بیاد بگیره ازم</span>
                </label>
              </div>
            </div>

            {/* Location Map */}
            <div className="w-4/5 mx-auto my-2 text-end">
              <label className="block font-PeydaBold text-sm mb-2">
                موقعیت مکانی محصول
              </label>
              <Map
                position={position}
                zoom={product.latitude && product.longitude ? 15 : 10}
                setCoordinates={handleSetCoordinates}
                locations={[]}
              />
              {coordinates && (
                <div className="mt-4">
                  <p>موقعیت مکانی انتخاب شده</p>
                  <p>Latitude: {coordinates[0]}</p>
                  <p>Longitude: {coordinates[1]}</p>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <CustomButton
              title="بروزرسانی"
              type="primary-btn"
              loading={updateProduct.isLoading}
              disabled={!isDirty && imageUrls.length === 0}
            />
          </form>
        )}
      </div>
    </WithRole>
  );
}
export const dynamic = "force-dynamic";

export default UpdateProductForm;
