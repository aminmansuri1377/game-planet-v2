// pages/search.tsx
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
import ProductCard from "@/components/ui/ProductCard";
import ProductImg from "../../../public/images/p2.webp";
import toast from "react-hot-toast";
import Header from "@/components/Header";

const Map = dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});
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
const SearchResultsPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { data: session } = useSession();

  const buyerId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const [buyerLocation, setBuyerLocation] = useRecoilState(buyerLocationAtom);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [sortByPrice, setSortByPrice] = useState(false); // State for sorting
  const [sortByNearest, setSortByNearest] = useState(false); // State for sorting by nearest
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
  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
  };
  useEffect(() => {
    if (coordinates) {
      setBuyerLocation({ latitude: coordinates[0], longitude: coordinates[1] });
    }
  }, [coordinates, setBuyerLocation]);
  const {
    data: products,
    isLoading,
    error,
    refetch,
  } = trpc.main.searchProducts.useQuery({
    query: query as string,
    sortByPrice,
    city: selectedCity,
  });
  const handleSortByPriceChange = () => {
    setSortByPrice((prev) => !prev); // Toggle sorting by price
    setSortByNearest(false); // Disable sorting by nearest
  };

  const handleSortByNearestChange = () => {
    setSortByNearest((prev) => !prev); // Toggle sorting by nearest
    setSortByPrice(false); // Disable sorting by price
  };
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
  const handleSave = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to the parent div

    if (!buyerId) return;

    const isSaved = savedProducts?.some((sp) => sp.productId === productId);

    if (isSaved) {
      unsaveProductMutation.mutate({ buyerId, productId });
    } else {
      saveProductMutation.mutate({ buyerId, productId });
    }
  };
  const productLocations =
    products &&
    products.map((product) => ({
      name: product.name,
      coordinates: [product?.latitude, product?.longitude],
    }));
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
    <div className="px-6">
      <Header />
      <div onClick={() => router.back()} className=" my-3">
        <FaArrowLeftLong />
      </div>

      <div className="mb-6">
        <h2 className="font-PeydaBold text-lg mb-2">Set Your Location</h2>
        <Map
          position={position}
          locations={productLocations}
          zoom={10}
          setCoordinates={handleSetCoordinates}
        />
        {coordinates && (
          <div className="mt-4">
            <p>Selected Coordinates:</p>
            <p>Latitude: {coordinates[0]}</p>
            <p>Longitude: {coordinates[1]}</p>
          </div>
        )}
      </div>
      <h1 className="text-2xl font-bold mb-6">{`Search Results for ${query}`}</h1>
      <div className="mb-6">
        <div className="relative mb-4">
          <input
            type="text"
            placeholder="Filter by city"
            value={cityQuery}
            onChange={(e) => handleCitySearch(e.target.value)}
            className="py-3 px-4 w-full mx-auto my-2 text-end font-PeydaBold rounded-full bg-gradient-to-r from-gra-100 to-gra-200"
          />
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
          {selectedCity && (
            <button
              onClick={handleClearFilter}
              className="mt-2 px-4 py-2 bg-red-500 text-white rounded"
            >
              Clear Filter
            </button>
          )}
        </div>
      </div>
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByPrice}
            onChange={handleSortByPriceChange}
            className="form-radio"
          />
          <span>Sort by Price (Low to High)</span>
        </label>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByNearest}
            onChange={handleSortByNearestChange}
            className="form-radio"
          />
          <span>Sort by Nearest Location</span>
        </label>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {sortedProducts?.map((product) => {
            const isSaved = savedProducts?.some(
              (sp) => sp.productId === product.id
            );
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
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SearchResultsPage;
