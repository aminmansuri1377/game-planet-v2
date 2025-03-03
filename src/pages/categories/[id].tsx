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

  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
  };

  const {
    data: products,
    isLoading,
    error,
  } = trpc.main.getProductsByCategory.useQuery({
    categoryId: Number(id),
    sortByPrice,
  });

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
    <div>
      <Header />
      <div className="p-6">
        <div onClick={() => router.back()}>
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

        <h1 className="text-2xl font-bold mb-6">Products in Category</h1>
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
          {sortedProducts?.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/singleProduct/${product.id}`)}
            >
              <DeviceCard
                buyerId={buyerId}
                product={product}
                info={`Price: $${product.price}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryProductsPage;
