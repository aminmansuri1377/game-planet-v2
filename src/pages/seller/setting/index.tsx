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
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
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
      <div className="w-full min-h-screen">
        <HeadOfPages
          title="تنظیمات"
          back={
            <div onClick={handleBack} className="m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <IoSettingsOutline size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />
        <div className="p-6">
          <Box>
            <div className="">
              <Box lessPaddingY className={"my-5"}>
                <div className="flex justify-end items-center">
                  <h1 className="font-PeydaBold text-white mx-3">
                    {t("rent.manageNotifications")}
                  </h1>
                  <IoIosNotificationsOutline size={30} />
                </div>
              </Box>

              <div className="flex flex-col items-end gap-4">
                <h1 className="font-PeydaBold text-white mx-3">
                  تغییر عکس پروفایل
                </h1>

                {/* Current Profile Image Display */}
                {currentProfileImage && !editMode && (
                  <div className="relative group">
                    <Image
                      src={currentProfileImage}
                      alt="Profile"
                      width={150}
                      height={150}
                      className="rounded-full object-cover border-2 border-white"
                    />
                    <button
                      onClick={toggleEditMode}
                      className="absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <MdOutlineEdit size={20} />
                    </button>
                  </div>
                )}

                {/* Uploader in Edit Mode */}
                {editMode && (
                  <>
                    <Uploader
                      bucket="profile-photo"
                      singleUpload={true}
                      onUpload={(urls) => setImageUrls(urls)}
                    />
                    <div className="flex gap-2">
                      <CustomButton
                        title="ذخیره"
                        type="primary-btn"
                        onClick={onSubmit}
                        loading={isLoading}
                        disabled={isLoading || imageUrls.length === 0}
                      />
                      <CustomButton
                        title="انصراف"
                        type="secondary-btn"
                        onClick={toggleEditMode}
                        disabled={isLoading}
                      />
                    </div>
                  </>
                )}

                {/* Show edit button if not in edit mode and no image exists */}
                {!currentProfileImage && !editMode && (
                  <button
                    onClick={toggleEditMode}
                    className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
                  >
                    <MdOutlineEdit size={20} />
                    افزودن عکس پروفایل
                  </button>
                )}
              </div>
            </div>
          </Box>
        </div>
        <CustomModal type="general" show={open} onClose={closeModal}>
          <EditProfile />
        </CustomModal>
      </div>
    </WithRole>
  );
}
//export const dynamic = "force-dynamic";

export default Setting;
