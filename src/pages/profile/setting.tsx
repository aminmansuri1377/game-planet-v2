import Box from "@/components/Box";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { IoIosNotificationsOutline } from "react-icons/io";
import { LuWallet2 } from "react-icons/lu";
import { HiOutlineLogout } from "react-icons/hi";
import { signOut } from "next-auth/react";
import CustomModal from "@/components/ui/CustomModal";
import EditProfile from "@/components/EditProfile";

function setting() {
  const router = useRouter();
  const { t } = useTranslation();
  const handleBack = () => {
    router.back();
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
              <LuWallet2 size={30} />
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
  );
}

export default setting;
