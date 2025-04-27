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
import { PrismaClient } from "@prisma/client";
import { isProfileComplete } from "../../../../utils/checkProfileCompletion";
import Loading from "@/components/ui/Loading";
import dynamic from "next/dynamic";
import { Input } from "@/components/ui/input";
import Uploader from "@/components/uploader/Uploader";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { GoPlusCircle } from "react-icons/go";
import { WithRole } from "@/components/auth/WithRole";

const Map = dynamic(() => import("@/components/MyMap"), {
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
  images?: FileList;
  latitude?: number;
  longitude?: number;
  city?: string;
  address?: string;
  useSavedLocation: boolean;
  savedLocationId?: number;
};

export default function CreateProductForm() {
  const prisma = new PrismaClient();

  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [uploaded, setUploaded] = useState(false);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [useSavedLocation, setUseSavedLocation] = useState(false);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]);
  const [filteredCities, setFilteredCities] = useState<
    { id: number; name: string }[]
  >([]);
  const [cityQuery, setCityQuery] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  useEffect(() => {
    // Load cities from JSON file
    fetch("/data/iran-cities.json")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        setFilteredCities(data);
      });
  }, []);
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
    setValue("city", cityName);
    setCityQuery(cityName);
    setFilteredCities([]);
  };
  const { data: locationsData } = trpc.main.getSellerLocations.useQuery(
    { sellerId: userId! },
    { enabled: !!userId && useSavedLocation }
  );
  console.log("locationsData", locationsData);
  useEffect(() => {
    if (locationsData) {
      setSavedLocations(locationsData);
    }
  }, [locationsData]);
  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getSellerById.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );
  // const [isUploading, setIsUploading] = useState(false);
  const [guaranty, setGuaranty] = useState<{ id: number; text: string }[]>([]);
  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
  };
  const { register, handleSubmit, reset, watch, setValue } =
    useForm<ProductInput>({
      defaultValues: {
        sendingType: [],
        address: "",
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

    // Validate based on location selection method
    if (data.useSavedLocation) {
      if (!data.savedLocationId) {
        toast.custom(
          <ToastContent
            type="error"
            message="Please select one of your saved locations"
          />
        );
        return;
      }
    } else {
      // For new location
      if (!data.address) {
        toast.custom(
          <ToastContent type="error" message="Address is required" />
        );
        return;
      }
      if (!coordinates) {
        toast.custom(
          <ToastContent
            type="error"
            message="Please select a location on the map"
          />
        );
        return;
      }
    }

    try {
      const productData = {
        ...data,
        sellerId: userId,
        images: imageUrls,
        // Only include coordinates if not using saved location
        ...(data.useSavedLocation
          ? {}
          : {
              latitude: coordinates?.[0],
              longitude: coordinates?.[1],
            }),
      };

      await createProduct.mutateAsync(productData);
      toast.custom(
        <ToastContent type="success" message="Product created successfully!" />
      );
      router.push("/seller/products");
    } catch (error) {
      toast.custom(
        <ToastContent type="error" message="Failed to create product." />
      );
    }
  };
  const handleLocationSelect = (locationId: number) => {
    const selectedLocation = savedLocations.find(
      (loc) => loc.id === locationId
    );
    if (selectedLocation) {
      setValue("address", selectedLocation.address, { shouldValidate: true });
      setValue("latitude", selectedLocation.latitude);
      setValue("longitude", selectedLocation.longitude);
      setValue("city", selectedLocation.city || "");
      // Set the coordinates state as well
      setCoordinates([selectedLocation.latitude, selectedLocation.longitude]);
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
  if (userId === null || isNaN(userId)) {
    return <div>Error: Invalid user ID. Please log in again.</div>;
  }

  if (!isProfileComplete(seller)) {
    return (
      <div>
        <div onClick={() => router.back()}>
          <FaArrowLeftLong />
        </div>
        <div className="mt-4 text-center">
          <p>Please complete your profile before creating a product.</p>
          <button
            onClick={() => router.push("/seller/completeProfile")}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
          >
            Complete Profile
          </button>
        </div>
      </div>
    );
  }
  return (
    <WithRole allowedRoles={["seller"]}>
      <div>
        <HeadOfPages
          title="ایجاد محصول"
          back={
            <div onClick={() => router.back()} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <GoPlusCircle size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto text-center mt-8"
        >
          <h1 className=" font-PeydaRegular text-lg">
            اطلاعات محصول خود را وارد کنید
          </h1>
          {/* Product Name */}
          <Input
            className=" py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
            type="text"
            placeholder={t("rent.productName")}
            {...register("name", { required: true })}
          />

          {/* Product Description */}
          <Input
            className=" py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
            type="text"
            placeholder={t("rent.description")}
            {...register("description", { required: true })}
          />

          {/* Product Price */}
          <Input
            className=" py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
            type="number"
            placeholder={t("rent.price")}
            {...register("price", { required: true, valueAsNumber: true })}
          />

          {/* Product Inventory */}
          <Input
            className=" py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
            type="number"
            placeholder="موجودی"
            {...register("inventory", { required: true, valueAsNumber: true })}
          />
          {/* {!useSavedLocation && (
            <Input
              className=" py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
              type="text"
              placeholder={"آدرس"}
              {...register("address", { required: true, valueAsNumber: true })}
            />
          )} */}
          <Uploader
            onUpload={(urls) => setImageUrls(urls)}
            bucket="product-images"
            setUploaded={setUploaded}
          />
          <div className="w-4/5 mx-auto my-2 text-end relative mb-10">
            <label className="block font-PeydaBold text-sm mb-2">شهر</label>
            <input
              type="text"
              placeholder="جستجوی شهر"
              value={cityQuery}
              onChange={(e) => handleCitySearch(e.target.value)}
              className="py-3 px-4 w-full mx-auto my-2 text-end font-PeydaBold rounded-full bg-gradient-to-r from-gra-100 to-gra-200"
            />
            {/* Show suggestions dropdown */}
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
            className=" bg-gradient-to-r from-gra-100 to-gra-200 border-2 border-primary text-black rounded-xl py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
            {...register("categoryId", { required: true, valueAsNumber: true })}
          >
            <option className=" bg-primary" value="">
              انتخاب دسته بندی
            </option>
            {categories.map((category) => (
              <option
                className=" bg-primary"
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Guaranty Selection */}
          <select
            className=" bg-gradient-to-r from-gra-100 to-gra-200 border-2 border-primary text-black rounded-xl py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
            {...register("guarantyId", { required: true, valueAsNumber: true })}
          >
            <option className=" bg-primary" value="">
              نوع ضمانت
            </option>
            {guaranty.map((guaranty) => (
              <option
                className=" bg-primary"
                key={guaranty.id}
                value={guaranty.id}
              >
                {guaranty.text}
              </option>
            ))}
          </select>

          {/* Sending Type */}
          <div className="w-4/5 mx-auto my-2 text-end">
            <label className="block font-PeydaBold text-sm mb-2">
              نوع نحویل
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={watch("sendingType").includes("SELLER_SENDS")}
                  onChange={() => handleSendingTypeChange("SELLER_SENDS")}
                  className="form-checkbox"
                />
                <span className="font-PeydaBold">میبرم براش</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={watch("sendingType").includes("BUYER_PICKS_UP")}
                  onChange={() => handleSendingTypeChange("BUYER_PICKS_UP")}
                  className="form-checkbox"
                />
                <span className="font-PeydaBold">بیاد بگیره ازم</span>
              </label>
            </div>
          </div>

          <div className="w-4/5 mx-auto my-2 text-end">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={useSavedLocation}
                onChange={(e) => setUseSavedLocation(e.target.checked)}
                className="form-checkbox"
              />
              <span className="font-PeydaBold">
                استفاده از آدرس های ذخیره شده
              </span>
            </label>
          </div>
          {useSavedLocation ? (
            <div className="w-4/5 mx-auto my-2 text-end">
              <label className="block font-PeydaBold text-sm mb-2">
                انتخاب از آدرس های ذخیره شده
              </label>
              <select
                className="bg-gradient-to-r from-gra-100 to-gra-200 border-2 border-primary text-black rounded-xl py-3 px-4 w-full mx-auto my-2 text-end font-PeydaBold text-sm"
                {...register("savedLocationId", {
                  required: "Please select a location",
                })}
                onChange={(e) => handleLocationSelect(Number(e.target.value))}
              >
                <option value="">انتخاب آدرس</option>
                {savedLocations.map((location) => (
                  <option key={location.id} value={location.id}>
                    {location.title} - {location.address}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <Input
                className="py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold"
                type="text"
                placeholder={"آدرس"}
                {...register("address", {
                  required: "Address is required",
                })}
              />

              {/* Map component */}
              <div className="w-4/5 mx-auto my-2 text-end">
                <label className="block font-PeydaBold text-sm mb-2">
                  موقعیت مکانی محصول
                </label>
                <Map
                  position={position}
                  zoom={10}
                  setCoordinates={handleSetCoordinates}
                  locations={[]}
                />
              </div>
            </>
          )}
          {/* Submit Button */}
          <CustomButton
            title={t("rent.create")}
            type="primary-btn"
            loading={createProduct.isLoading}
            disabled={!uploaded}
          />
        </form>
      </div>
    </WithRole>
  );
}
