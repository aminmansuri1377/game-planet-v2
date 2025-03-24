import Box from "../../components/Box";
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
import CustomModal from "../../components/ui/CustomModal";
import EditProfile from "../../components/EditProfile";
import Uploader from "@/components/uploader/Uploader";
import { trpc } from "../../../utils/trpc";
import toast from "react-hot-toast";
import CustomButton from "@/components/ui/CustomButton";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";

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

  const photoBuyerProfile = trpc.main.photoBuyerProfile.useMutation();
  console.log("imageUrls", imageUrls);
  const onSubmit = async () => {
    setIsLoading(true);
    try {
      let response;
      response = await photoBuyerProfile.mutateAsync({
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
    <div className=" w-full min-h-screen">
      <HeadOfPages
        title="تنظیمات"
        back={
          <div onClick={handleBack} className=" m-5">
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
      <div className=" p-6">
        <Box>
          <div className="">
            <Box lessPaddingY className={"my-5"}>
              <div className=" flex justify-end items-center">
                <h1 className=" font-PeydaBold text-white mx-3">
                  {t("rent.manageNotifications")}
                </h1>
                <IoIosNotificationsOutline size={30} />
              </div>
            </Box>
            {/* <Box lessPaddingY className={"my-5"}>
            <div className=" flex justify-end items-center">
              <h1 className=" font-PeydaBold text-white mx-3">
                {t("rent.wallet")}
              </h1>
              <LuWallet size={30} />
            </div>
          </Box> */}
            <div className=" flex justify-end items-center">
              <h1 className=" font-PeydaBold text-white mx-3">
                تغییر عکس پروفایل
              </h1>
              <Uploader
                bucket="profile-photo"
                singleUpload={true}
                onUpload={(urls) => setImageUrls(urls)}
              />
              <CustomButton
                title="update"
                type="primary-btn"
                onClick={onSubmit}
              />
            </div>
          </div>
        </Box>
      </div>
      <CustomModal type="general" show={open} onClose={closeModal}>
        <EditProfile />
      </CustomModal>
    </div>
  );
}

export default setting;
