import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";
import ToastContent from "@/components/ui/ToastContent";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { WithRole } from "@/components/auth/WithRole";
const Map = dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});
function MyAddresses() {
  const { data: session } = useSession();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null);
  const [address, setAddress] = useState("");
  const [title, setTtitle] = useState("");
  const [position, setPosition] = useState([35.6892, 51.389]);

  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  const handleSetCoordinates = (coords: [number, number]) => {
    setCoordinates(coords);
    setPosition(coords);
  };
  const addLocation = trpc.main.addLocation.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Location saved successfully!" />
      );
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err.message} />);
    },
  });
  const { data: locations, isLoading } = trpc.main.getUserLocations.useQuery(
    {
      buyerId: userId ? userId : undefined,
    },
    { enabled: !!userId }
  );
  const handleSaveLocation = () => {
    if (!coordinates || !address) {
      toast.custom(
        <ToastContent
          type="error"
          message="Please select a location and enter an address."
        />
      );
      return;
    }

    addLocation.mutate({
      title,
      latitude: coordinates[0],
      longitude: coordinates[1],
      address,
      buyerId: userId ? userId : undefined,
    });
  };
  return (
    <WithRole allowedRoles={["buyer"]}>
      <div>
        <div onClick={handleBack}>
          <FaArrowLeftLong />
        </div>
        <div className="w-4/5 mx-auto my-2 text-end">
          <input
            type="text"
            placeholder="Enter your title"
            value={title}
            onChange={(e) => setTtitle(e.target.value)}
            className=" text-black"
          />
          <label className="block font-PeydaBold text-sm mb-2">Location</label>
          <Map
            position={position}
            zoom={10}
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
          <input
            type="text"
            placeholder="Enter your address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className=" text-black"
          />
        </div>
        <button onClick={handleSaveLocation}>Save Location</button>
        {locations?.map((location) => (
          <div key={location.id}>
            <p>Address: {location.title}</p>
            <p>Address: {location.address}</p>
            <p>
              Coordinates: {location.latitude}, {location.longitude}
            </p>
          </div>
        ))}
      </div>
    </WithRole>
  );
}

export default MyAddresses;
