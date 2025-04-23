import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import { useRecoilState } from "recoil";
import { buyerLocationAtom } from "../../../store/atoms/buyerLocationAtom";
import Header from "@/components/Header";
import ProductCard from "@/components/ui/ProductCard";
import ProductImg from "../../../public/images/p2.webp";
import { PiCityDuotone } from "react-icons/pi";
import { MdOutlineDeleteForever } from "react-icons/md";

import toast from "react-hot-toast";
const Map = dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});

// Haversine formula to calculate distance between two coordinates
const haversineDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const R = 6371; // Radius of the Earth in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
};

const CategoryProductsPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { data: session } = useSession();
  const buyerId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const [buyerLocation, setBuyerLocation] = useRecoilState(buyerLocationAtom);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [sortByPrice, setSortByPrice] = useState(false); // State for sorting by price
  const [sortByNearest, setSortByNearest] = useState(false); // State for sorting by nearest
  const utils = trpc.useUtils();

  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
  };

  const [cityQuery, setCityQuery] = useState(""); // State for city search query
  const [selectedCity, setSelectedCity] = useState(""); // State for selected city
  const [cities, setCities] = useState<{ id: number; name: string }[]>([]); // State for all cities
  const [filteredCities, setFilteredCities] = useState<
    { id: number; name: string }[]
  >([]); // State for filtered cities

  // Load cities from JSON file
  useEffect(() => {
    fetch("/data/iran-cities.json")
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
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
    setSelectedCity(cityName); // Set the selected city
    setCityQuery(cityName); // Update the input field with the selected city
    setFilteredCities([]); // Clear the suggestions dropdown
  };
  const handleClearFilter = () => {
    setSelectedCity(""); // Clear the selected city
    setCityQuery(""); // Clear the city search query
  };
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = trpc.main.getProductsByCategory.useQuery({
    categoryId: Number(id),
    sortByPrice,
    city: selectedCity, // Pass the selected city to the API
  });
  const { data: savedProducts } = trpc.main.getSavedProducts.useQuery(
    {
      buyerId,
    },
    {
      enabled: !!buyerId, // Only fetch if buyerId is available
    }
  );
  const saveProductMutation = trpc.main.saveProduct.useMutation({
    onSuccess: () => {
      toast.success("Product saved successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unsaveProductMutation = trpc.main.unsaveProduct.useMutation({
    onSuccess: () => {
      toast.success("Product unsaved successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleSave = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buyerId) return;

    const isSaved = savedProducts?.some((sp) => sp.productId === productId);

    // Optimistic update
    utils.main.getSavedProducts.setData({ buyerId }, (old) => {
      if (!old) return old;
      return isSaved
        ? old.filter((sp) => sp.productId !== productId)
        : [
            ...old,
            {
              buyerId,
              productId,
              product: products?.find((p) => p.id === productId),
            },
          ];
    });

    try {
      if (isSaved) {
        await unsaveProductMutation.mutateAsync({ buyerId, productId });
      } else {
        await saveProductMutation.mutateAsync({ buyerId, productId });
      }
    } catch (err) {
      // Revert if error
      utils.main.getSavedProducts.invalidate({ buyerId });
      console.error(err);
    }
  };
  const handleSortByPriceChange = () => {
    setSortByPrice((prev) => !prev); // Toggle sorting by price
    setSortByNearest(false); // Disable sorting by nearest
  };

  const handleSortByNearestChange = () => {
    setSortByNearest((prev) => !prev); // Toggle sorting by nearest
    setSortByPrice(false); // Disable sorting by price
  };

  useEffect(() => {
    if (coordinates) {
      setBuyerLocation({ latitude: coordinates[0], longitude: coordinates[1] });
    }
  }, [coordinates, setBuyerLocation]);

  const productLocations =
    products &&
    products.map((product) => ({
      name: product.name,
      coordinates: [product?.latitude, product?.longitude],
      id: product.id,
    }));

  // Sort products by nearest location if sortByNearest is true
  const sortedProducts =
    sortByNearest && coordinates
      ? products?.slice().sort((a, b) => {
          const distanceA = haversineDistance(
            coordinates[0],
            coordinates[1],
            a.latitude,
            a.longitude
          );
          const distanceB = haversineDistance(
            coordinates[0],
            coordinates[1],
            b.latitude,
            b.longitude
          );
          return distanceA - distanceB;
        })
      : products;

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className=" min-h-screen px-3">
      <Header />
      <div className="py-6 px-2">
        <div onClick={() => router.back()} className=" my-3">
          <FaArrowLeftLong />
        </div>

        <div className="mb-6">
          <h2 className="font-PeydaBold text-lg mb-2">
            موقعیت مکانی خود را مشخص کنید
          </h2>
          <Map
            position={position}
            locations={productLocations}
            zoom={10}
            setCoordinates={handleSetCoordinates}
          />
          {coordinates && (
            <div className="mt-4">
              <p>موقعیت مکانی انتخاب شده</p>
              <p>Latitude: {coordinates[0]}</p>
              <p>Longitude: {coordinates[1]}</p>
            </div>
          )}
        </div>

        {/* <h1 className="text-2xl font-bold mb-6">Products in Category</h1> */}
        <div className="mb-6">
          <div className="relative mb-4 flex">
            {selectedCity && (
              <MdOutlineDeleteForever
                size={30}
                onClick={handleClearFilter}
                className=" mt-2 text-red-500 rounded"
              />
            )}
            <input
              type="text"
              placeholder="انتخاب شهر"
              value={cityQuery}
              onChange={(e) => handleCitySearch(e.target.value)}
              className="py-3 px-4 text-end font-PeydaBold rounded-full bg-gradient-to-r from-gra-100 to-gra-200"
            />
            {/* <PiCityDuotone size={30} className=" mt-2 mx-2" /> */}
            {filteredCities.length > 0 && (
              <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full z-10 text-amber-950">
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
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sortByPrice}
              onChange={handleSortByPriceChange}
              className="form-radio"
            />
            <span className=" font-PeydaRegular">کمترین قیمت ها</span>
          </label>
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={sortByNearest}
              onChange={handleSortByNearestChange}
              className="form-radio"
            />
            <span className=" font-PeydaRegular">نزدیک ترین محصولات</span>
          </label>
        </div>
        <div className="space-y-4 ">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {sortedProducts?.map((product) => {
              const isSaved = savedProducts?.some(
                (sp) => sp.productId === product.id
              );
              const distance = coordinates
                ? haversineDistance(
                    coordinates[0],
                    coordinates[1],
                    product?.latitude,
                    product?.longitude
                  )
                : null;
              return (
                <div
                  key={product.id}
                  onClick={() => router.push(`/singleProduct/${product.id}`)}
                >
                  <ProductCard
                    imgUrl={product?.images ? product?.images[0] : ProductImg}
                    imgAlt={product.name}
                    name={product.name}
                    price={`${product.price}`}
                    handleSave={(e) => handleSave(product.id, e)} // Pass the event
                    isSaved={isSaved}
                    rate={8}
                    distance={distance}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
