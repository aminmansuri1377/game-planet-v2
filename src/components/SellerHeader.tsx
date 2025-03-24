import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoPersonSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { CgEnter } from "react-icons/cg";
import CustomModal from "./ui/CustomModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { HiMiniLanguage } from "react-icons/hi2";
import RoundButton from "./ui/RoundButton";
import { CiShoppingBasket } from "react-icons/ci";
import { MdMailOutline } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { GrHistory } from "react-icons/gr";
import { FiSettings } from "react-icons/fi";
import { FiBookmark } from "react-icons/fi";
import { LuHeadphones } from "react-icons/lu";
import Divider from "./ui/Divider";
import { useResetRecoilState } from "recoil";
import { sessionAtom } from "../../store/atoms/sessionAtom";
import { CiLogout } from "react-icons/ci";

function SellerHeader() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleProfile = () => {
    router.push({ pathname: "/seller/profile" });
  };
  const handleBasket = () => {
    router.push({ pathname: "/profile/basket" });
  };
  const handleSign = () => {
    router.push({ pathname: "/signIn" });
  };
  const handleChat = () => {
    router.push({ pathname: "/seller/chat" });
  };
  const handleHome = () => {
    router.push({ pathname: "/seller" });
  };
  const closeModal = () => {
    setOpen(false);
  };
  const resetSession = useResetRecoilState(sessionAtom);

  const handleSignOut = async () => {
    resetSession();
    await signOut({ redirect: false });
    router.push("/");
    setIsMenuOpen(false);
  };
  return (
    <div>
      <div
        className={`top-0 pt-10 w-full flex justify-between py-5 items-center z-50 px-0 bg-transparent`}
      >
        <div className="text-center items-center " onClick={handleHome}>
          <h1 className="text-center font-black text-text2 text-4xl  ">
            RENTTA{" "}
          </h1>
        </div>
        {/* {session ? (
        <RoundButton
          handleClick={handleProfile}
          Children={<IoPersonSharp size={28} className="text-gray-300" />}
        />
      ) : (
        <RoundButton
          handleClick={handleChat}
          Children={<CgEnter size={28} className="text-gray-300" />}
        />
      )} */}
        <div className=" flex justify-around gap-3 ">
          {/* <RoundButton
            handleClick={handleBasket}
            Children={<CiShoppingBasket size={28} className="text-gray-300" />}
          /> */}
          <RoundButton
            handleClick={handleChat}
            Children={<MdMailOutline size={28} className="text-gray-300" />}
          />
          {/* <RoundButton
        handleClick={() => setOpen(true)}
        Children={<HiMiniLanguage size={28} className="text-gray-300" />}
        /> */}
          <RoundButton
            handleClick={() => setIsMenuOpen(true)}
            Children={<IoMdMenu size={28} className="text-gray-300" />}
          />
        </div>
      </div>
      <CustomModal type="general" show={open} onClose={closeModal}>
        <LanguageSwitcher onClose={closeModal} />
      </CustomModal>
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-50"
          onClick={() => setIsMenuOpen(false)}
        ></div>
      )}

      {/* Sliding Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-2/3 md:w-1/4 bg-cardbg shadow-lg z-50 transform transition-transform ${
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-5 flex flex-col gap-4">
          <h1 className="text-center font-black text-text2 text-4xl mx-4 mb-5">
            RENTA{" "}
          </h1>
          <div
            onClick={() => router.push({ pathname: "/seller/profile" })}
            className=" flex justify-end my-1"
          >
            <h2 className=" text-text2 mx-5 font-PeydaBold">پروفایل</h2>
            <CgProfile size={28} className="text-text2" />
          </div>
          <Divider />
          {/* <div
            onClick={() => router.push({ pathname: "/profile/basket" })}
            className=" flex justify-end my-1"
          >
            <h2 className=" text-text2 mx-5 font-PeydaBold">تاریخچه</h2>
            <GrHistory size={28} className="text-text2" />
          </div>
          <Divider /> */}
          <div
            onClick={() => router.push({ pathname: "/profile/setting" })}
            className=" flex justify-end my-1"
          >
            <h2 className=" text-text2 mx-5 font-PeydaBold">تنظیمات</h2>
            <FiSettings size={28} className="text-text2" />
          </div>
          <Divider />
          {/* <div
            onClick={() =>
              router.push({ pathname: "/profile/SavedProductsPage" })
            }
            className=" flex justify-end my-1"
          >
            <h2 className=" text-text2 mx-5 font-PeydaBold">ذخیره ها </h2>
            <FiBookmark size={28} className="text-text2" />
          </div>
          <Divider /> */}
          <div
            className=" flex justify-end my-1"
            onClick={() => router.push({ pathname: "/seller/support" })}
          >
            <h2 className=" text-text2 mx-5 font-PeydaBold"> پشتیبانی </h2>
            <LuHeadphones size={28} className="text-text2" />
          </div>
          <Divider />
          <div className=" flex justify-end my-1" onClick={handleSignOut}>
            <h2 className=" text-red-600 mx-5 font-PeydaBold">
              {" "}
              خروج از حساب{" "}
            </h2>
            <CiLogout size={28} className="text-red-600" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellerHeader;
