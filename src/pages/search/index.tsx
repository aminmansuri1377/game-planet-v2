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

const Map = dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});
const SearchResultsPage = () => {
  const router = useRouter();
  const { query } = router.query;
  const { data: session } = useSession();

  const buyerId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const [buyerLocation, setBuyerLocation] = useRecoilState(buyerLocationAtom);
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [position, setPosition] = useState([35.6892, 51.389]);
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
  } = trpc.main.searchProducts.useQuery({
    query: query as string,
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <div className="mb-6">
        <h2 className="font-PeydaBold text-lg mb-2">Set Your Location</h2>
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
      <h1 className="text-2xl font-bold mb-6">{`Search Results for ${query}`}</h1>
      <div className="space-y-4">
        {products?.map((product) => (
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
  );
};

export default SearchResultsPage;
