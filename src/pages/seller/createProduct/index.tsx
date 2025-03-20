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
};

export default function CreateProductForm() {
  const prisma = new PrismaClient();

  const router = useRouter();
  const { data: session } = useSession();
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
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
    setValue("city", cityName); // Set the selected city in the form
    setCityQuery(cityName); // Update the input field with the selected city
    setFilteredCities([]); // Clear the suggestions dropdown
  };

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

    try {
      createProduct.mutate({
        ...data,
        sellerId: userId,
        latitude: coordinates?.[0],
        longitude: coordinates?.[1],
        images: imageUrls,
      });
    } catch (error) {
      toast.custom(
        <ToastContent type="error" message="Failed to upload images." />
      );
    } finally {
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
    <div>
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto text-center">
        <h2 className="font-PeydaBold text-lg">{t("rent.productCreation")}</h2>

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
          placeholder={t("rent.inventory")}
          {...register("inventory", { required: true, valueAsNumber: true })}
        />
        <Uploader
          onUpload={(urls) => setImageUrls(urls)}
          bucket="product-images"
        />
        <div className="w-4/5 mx-auto my-2 text-end relative mb-10">
          <label className="block font-PeydaBold text-sm mb-2">City</label>
          <input
            type="text"
            placeholder="Search for a city"
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
            Select a category
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
            Select a guaranty
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

        <div className="w-4/5 mx-auto my-2 text-end">
          <label className="block font-PeydaBold text-sm mb-2">
            Product Location
          </label>
          <Map
            position={position}
            zoom={10}
            setCoordinates={handleSetCoordinates}
            locations={[]}
          />
          {coordinates && (
            <div className="mt-4">
              <p>Selected Coordinates:</p>
              <p>Latitude: {coordinates[0]}</p>
              <p>Longitude: {coordinates[1]}</p>
            </div>
          )}
        </div>
        {/* Submit Button */}
        <CustomButton
          title={t("rent.create")}
          type="primary-btn"
          loading={
            createProduct.isLoading
            // || isUploading
          }
        />
      </form>
    </div>
  );
}
