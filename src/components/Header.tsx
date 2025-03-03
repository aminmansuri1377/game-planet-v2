import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoPersonSharp } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { CgEnter } from "react-icons/cg";
import CustomModal from "./ui/CustomModal";
import LanguageSwitcher from "./LanguageSwitcher";
import { HiMiniLanguage } from "react-icons/hi2";
import RoundButton from "./ui/RoundButton";
import { CiShoppingBasket } from "react-icons/ci";
import { MdMailOutline } from "react-icons/md";
import { IoMdMenu } from "react-icons/io";

function Header() {
  const router = useRouter();
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);

  const handleProfile = () => {
    router.push({ pathname: "/profile" });
  };
  const handleBasket = () => {
    router.push({ pathname: "/profile/basket" });
  };
  const handleSign = () => {
    router.push({ pathname: "/signIn" });
  };
  const handleChat = () => {};
  const handleHome = () => {
    router.push({ pathname: "/" });
  };
  const closeModal = () => {
    setOpen(false);
  };
  return (
    <div
      className={`top-0 pt-10 w-full flex justify-around py-5 items-center z-50 px-6 bg-transparent`}
    >
      <div className="text-center items-center " onClick={handleHome}>
        <h1 className="text-center font-black text-text2 text-4xl mx-4 ">
          RENTA{" "}
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

      <RoundButton
        handleClick={handleBasket}
        Children={<CiShoppingBasket size={28} className="text-gray-300" />}
      />
      <div>
        <RoundButton
          handleClick={handleChat}
          Children={<MdMailOutline size={28} className="text-gray-300" />}
        />
        {/* <RoundButton
          handleClick={() => setOpen(true)}
          Children={<HiMiniLanguage size={28} className="text-gray-300" />}
        /> */}
      </div>
      <div>
        <RoundButton
          // handleClick={handleChat}
          Children={<IoMdMenu size={28} className="text-gray-300" />}
        />
      </div>
      <CustomModal type="general" show={open} onClose={closeModal}>
        <LanguageSwitcher onClose={closeModal} />
      </CustomModal>
    </div>
  );
}

export default Header;
