import Box from "../../../components/Box";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
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
import Image from "next/image";

function Setting() {
  const router = useRouter();
  const { t } = useTranslation();
  const handleBack = () => {
    router.back();
  };
  const { data: session, status } = useSession();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  // State for the profile photo
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentProfileImage, setCurrentProfileImage] = useState<string | null>(
    null
  );

  // Fetch current profile image
  const { data: sellerData, refetch } = trpc.main.getSellerProfile.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );

  useEffect(() => {
    if (
      sellerData?.profileImage &&
      Array.isArray(sellerData.profileImage) &&
      sellerData.profileImage.length > 0
    ) {
      setCurrentProfileImage(sellerData.profileImage[0]);
    }
  }, [sellerData]);

  const photoSellerProfile = trpc.main.photoSellerProfile.useMutation();

  const onSubmit = async () => {
    if (imageUrls.length === 0) {
      toast.error("Please select an image first");
      return;
    }

    setIsLoading(true);
    try {
      const response = await photoSellerProfile.mutateAsync({
        userId: userId!,
        profileImage: imageUrls,
      });

      if (response) {
        toast.success("Profile updated successfully!");
        setCurrentProfileImage(imageUrls[0]);
        setImageUrls([]);
        setEditMode(false);
        refetch();
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

  const toggleEditMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      setImageUrls([]);
    }
  };

  return (
    <WithRole allowedRoles={["seller"]}>
      <div className="w-full">
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
          <h1 className="font-PeydaBlack my-5">{t("rent.settings")}</h1>

          <div className="">
            {/* Edit Profile Section */}
            <Box lessPaddingY className={"my-5"}>
              <div
                className="flex justify-end items-center"
                onClick={() => setOpen(true)}
              >
                <h1 className="font-PeydaBold text-white mx-3">
                  {t("rent.editProfile")}
                </h1>
                <MdOutlineEdit size={30} />
              </div>
            </Box>

            {/* Profile Photo Section */}
            <Box lessPaddingY className={"my-5"}>
              <div className="flex flex-col items-end gap-4 p-4">
                <h1 className="font-PeydaBold text-white">
                  {t("rent.changeProfilePhoto")}
                </h1>

                {/* Current Profile Image Display */}
                {currentProfileImage && !editMode && (
                  <div className="relative group">
                    <Image
                      src={currentProfileImage}
                      alt="Profile"
                      width={120}
                      height={120}
                      className="rounded-full object-cover border-2 border-purple-500"
                    />
                    <button
                      onClick={toggleEditMode}
                      className="absolute bottom-0 right-0 bg-purple-600 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdOutlineEdit size={20} className="text-white" />
                    </button>
                  </div>
                )}

                {/* Uploader in Edit Mode */}
                {editMode && (
                  <div className="w-full">
                    <Uploader
                      bucket="profile-photo"
                      singleUpload={true}
                      onUpload={(urls) => setImageUrls(urls)}
                    />
                    <div className="flex gap-2 justify-end mt-3">
                      <CustomButton
                        title={t("rent.save")}
                        type="primary-btn"
                        onClick={onSubmit}
                        loading={isLoading}
                        disabled={isLoading || imageUrls.length === 0}
                      />
                      <CustomButton
                        title={t("rent.cancel")}
                        type="secondary-btn"
                        onClick={toggleEditMode}
                        disabled={isLoading}
                      />
                    </div>
                  </div>
                )}

                {/* Show edit button if not in edit mode and no image exists */}
                {!currentProfileImage && !editMode && (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg"
                  >
                    <MdOutlineEdit size={20} />
                    {t("rent.addProfilePhoto")}
                  </button>
                )}
              </div>
            </Box>

            {/* Other Settings Sections */}
            <Box lessPaddingY className={"my-5"}>
              <div className="flex justify-end items-center">
                <h1 className="font-PeydaBold text-white mx-3">
                  {t("rent.manageNotifications")}
                </h1>
                <IoIosNotificationsOutline size={30} />
              </div>
            </Box>

            <Box lessPaddingY className={"my-5"}>
              <div className="flex justify-end items-center">
                <h1 className="font-PeydaBold text-white mx-3">
                  {t("rent.wallet")}
                </h1>
                <LuWallet size={30} />
              </div>
            </Box>

            <div onClick={() => router.push("./MyAddresses")}>
              <Box lessPaddingY className={"my-5"}>
                <div className="flex justify-end items-center">
                  <h1 className="font-PeydaBold text-white mx-3">
                    {t("rent.myLocations")}
                  </h1>
                  <LuWallet size={30} />
                </div>
              </Box>
            </div>

            <div onClick={handleOut}>
              <Box lessPaddingY className={"my-5"}>
                <div className="flex justify-end items-center">
                  <h1 className="font-PeydaBold text-white mx-3">
                    {t("rent.logout")}
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

export default Setting;
