import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import React, { useState } from "react";
import { trpc } from "../../../utils/trpc";
import ToastContent from "@/components/ui/ToastContent";
import toast from "react-hot-toast";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { WithRole } from "@/components/auth/WithRole";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { MdOutlineAddLocationAlt } from "react-icons/md";
import CustomButton from "@/components/ui/CustomButton";

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
    onSuccess: async () => {
      toast.custom(
        <ToastContent
          type="success"
          message="آدرس و موقعیت مکانی شما با موفقیت ثبت شد!"
        />
      );
      await refetch();
      // Clear the form
      setTtitle("");
      setAddress("");
      setCoordinates(null);
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err.message} />);
    },
  });
  const {
    data: locations,
    isLoading,
    refetch,
  } = trpc.main.getUserLocations.useQuery(
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
          message="لطفا موقعیت مکانی و آدرس را صحیح وارد کنید."
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
      <HeadOfPages
        title="آدرس های من"
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
                  <MdOutlineAddLocationAlt size={40} className="text-center" />
                </div>
              }
            />
          </div>
        }
      />
      <div className=" mt-14 w-full">
        <div className="w-4/5 mx-auto my-2 text-end">
          <input
            type="text"
            placeholder="عنوان"
            value={title}
            onChange={(e) => setTtitle(e.target.value)}
            className=" text-black rounded-lg p-2 font-PeydaRegular"
          />
          {/* <label className="block font-PeydaBold text-sm mb-2">Location</label> */}
          <div className=" my-5">
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
          </div>
          <input
            type="text"
            placeholder="آدرس دقیق"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className=" text-black rounded-lg p-2 font-PeydaRegular"
          />
        </div>
        <CustomButton
          type="secondary-btn"
          title="ذخیره"
          onClick={handleSaveLocation}
        />
        {locations?.map((location) => (
          <div
            key={location.id}
            className=" m-5 text-center p-5 bg-secondary text-white font-PeydaRegular rounded-xl"
          >
            <p> {location.title}</p>
            <p>آدرس: {location.address}</p>
            <p>
              موقعیت: {location.latitude}, {location.longitude}
            </p>
          </div>
        ))}
      </div>
    </WithRole>
  );
}
//export const dynamic = "force-dynamic";

export default MyAddresses;
