import Box from "../../../components/Box";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuWallet } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";
import { signOut, useSession } from "next-auth/react";
import CustomModal from "../../../components/ui/CustomModal";
import EditProfile from "../../../components/EditProfile";
import Uploader from "@/components/uploader/Uploader";
import { trpc } from "../../../../utils/trpc";
import toast from "react-hot-toast";
import CustomButton from "@/components/ui/CustomButton";
import { WithRole } from "@/components/auth/WithRole";

function setting() {
  const router = useRouter();
  const { t } = useTranslation();
  const handleBack = () => {
    router.back();
  };
  const { data: session, status } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const photoSellerProfile = trpc.main.photoSellerProfile.useMutation();
  console.log("imageUrls", imageUrls);
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      let response;
      response = await photoSellerProfile.mutateAsync({
        userId,
        profileImage: imageUrls,
      });

      if (response) {
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };
  const handleOut = async () => {
    await signOut({ redirect: false });
    router.push("./");
  };
  const [open, setOpen] = useState(false);
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <WithRole allowedRoles={["seller"]}>
      <div className=" w-full">
        <Box>
          <div className="flex justify-between items-center mx-5">
            <div onClick={handleBack}>
              <FaArrowLeftLong />
            </div>
            <div className="flex rounded-full bg-gradient-to-tr shadow-xl shadow-purple-800 from-[#9E16BD] to-[#5F1470] p-3 items-center text-center mr-2">
              <IoSettingsOutline size={34} className="text-gray-300" />
            </div>
            <div></div>
          </div>
          <h1 className=" font-PeydaBlack my-5"> {t("rent.settings")} </h1>

          <div className="">
            <Box lessPaddingY className={"my-5"}>
              <div
                className=" flex justify-end items-center"
                onClick={() => setOpen(true)}
              >
                <h1 className=" font-PeydaBold text-white mx-3">
                  {t("rent.editProfile")}
                </h1>
                <MdOutlineEdit size={30} />
              </div>
            </Box>
            <Box lessPaddingY className={"my-5"}>
              <div className=" flex justify-end items-center">
                <h1 className=" font-PeydaBold text-white mx-3">
                  {t("rent.manageNotifications")}
                </h1>
                <IoIosNotificationsOutline size={30} />
              </div>
            </Box>
            <Box lessPaddingY className={"my-5"}>
              <div className=" flex justify-end items-center">
                <h1 className=" font-PeydaBold text-white mx-3">
                  {t("rent.wallet")}
                </h1>
                <LuWallet size={30} />
              </div>
            </Box>
            <div onClick={() => router.push("./MyAddresses")}>
              <Box lessPaddingY className={"my-5"}>
                <div className=" flex justify-end items-center">
                  <h1 className=" font-PeydaBold text-white mx-3">my loc</h1>
                  <LuWallet size={30} />
                </div>
              </Box>
            </div>
            <Box lessPaddingY className={"my-5"}>
              <div className=" flex justify-end items-center">
                <h1 className=" font-PeydaBold text-white mx-3">
                  change profile photo
                </h1>
                <Uploader
                  bucket="profile-photo"
                  singleUpload={true}
                  onUpload={(urls) => setImageUrls(urls)}
                />
                <LuWallet size={30} />
                <CustomButton
                  title="update"
                  type="primary-btn"
                  onClick={onSubmit}
                />
              </div>
            </Box>
            <div onClick={handleOut}>
              <Box lessPaddingY className={"my-5"}>
                <div className=" flex justify-end items-center">
                  <h1 className=" font-PeydaBold text-white mx-3">
                    {t("rent.logout")}{" "}
                  </h1>
                  <HiOutlineLogout size={30} />
                </div>
              </Box>
            </div>
          </div>
        </Box>
        <CustomModal type="general" show={open} onClose={closeModal}>
          <EditProfile />
        </CustomModal>
      </div>
    </WithRole>
  );
}

export default setting;
