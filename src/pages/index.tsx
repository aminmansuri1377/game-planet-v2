// pages/index.tsx
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Loading from "../components/ui/Loading";
import CustomButton from "../components/ui/CustomButton";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import dynamic from "next/dynamic";

const WelcomePage = () => {
  const Map = useMemo(
    () =>
      dynamic(() => import("@/components/MyMap"), {
        loading: () => <p>Loading map...</p>,
        ssr: false, // Disable SSR
      }),
    []
  );
  console.log("Rendering Map Component");
  const exampleLocations = [
    { name: "Location 1", coordinates: [35.6892, 51.389] },
    { name: "Location 2", coordinates: [35.7, 51.4] },
    { name: "Location 3", coordinates: [35.71, 51.41] },
    // Add more locations as needed
  ];
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [nearestLocations, setNearestLocations] = useState<
    { name: string; coordinates: [number, number] }[]
  >([]);
  const haversineDistance = (
    coords1: [number, number],
    coords2: [number, number]
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const [lat1, lon1] = coords1;
    const [lat2, lon2] = coords2;

    const R = 6371; // Earth radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
  };
  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords); // Update coordinates
    setPosition(coords); // Update position to move the marker

    // Filter nearest locations
    const nearest = exampleLocations
      .map((location) => ({
        ...location,
        distance: haversineDistance(coords, location.coordinates),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3); // Get the top 3 nearest locations

    setNearestLocations(nearest);
  };
  //////////////////////////////////////////////////////
  const handlePositionChange = (newPosition) => {
    setPosition(newPosition);
    console.log("New Position:", newPosition); // Optional: Log the new position
  };
  const handleLocationSelect = (location) => {
    console.log("Selected Location:", location);
    // You can send this location data to your backend via tRPC here
  };
  // const {
  //   data: categories,
  //   isLoading: isCategoriesLoading,
  //   error: categoriesError,
  // } = trpc.main.getCategories.useQuery();

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  const handleSearch = () => {
    router.push(`/search?query=${searchQuery}`);
  };
  // const handleSearch = () => {
  //   router.push(`/search/${searchQuery}`);
  // };
  const isSellerHandler = () => {
    router.push("/seller/signIn");
  };
  // if (isCategoriesLoading) return <Loading />;
  // if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  return (
    <div className="text-center">
      <h1 className="font-PeydaBlack text-center [word-spacing:5px] my-5">
        {t("rent.ps5AndXboxRental")}
      </h1>
      <Map
        position={position}
        zoom={10}
        setCoordinates={handleSetCoordinates}
        locations={exampleLocations}
      />
      {coordinates && (
        <div className="mt-4">
          <p>Selected Coordinates:</p>
          <p>Latitude: {coordinates[0]}</p>
          <p>Longitude: {coordinates[1]}</p>
          <h3>Nearest Locations:</h3>
          <ul>
            {nearestLocations.map((location, index) => (
              <li key={index}>
                {location.name} - {location.distance.toFixed(2)} km
              </li>
            ))}
          </ul>
        </div>
      )}
      <CustomButton
        type="primary-btn"
        title="اجاره دهنده هستم"
        onClick={() => isSellerHandler()}
      />
      {/* Search Input */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Categories */}
      <div>
        {/* {categories
          ? categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CustomButton title={category.name} type="secondary-btn" />
              </div>
            ))
          : ""} */}
      </div>
    </div>
  );
};

export default WelcomePage;
