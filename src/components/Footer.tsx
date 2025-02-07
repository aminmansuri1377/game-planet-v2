import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { useRouter } from "next/router";
import Cookies from "js-cookie";
import Image from "next/image";
import logo from "../../public/favicon.ico";
function Footer() {
  const router = useRouter();
  const { t } = useTranslation();

  return (
    <div>
      <div className=" bottom-0 bg-[#00154b] rounded-t-3xl pb-7 border-2 border-[#2c52b2]">
        <div className=" flex text-center items-center">
          <Image src={logo} alt="logo" className="scale-50" />
          <h1 className="text-center font-black text-3xl ">GAME PLANET</h1>
        </div>
        <div className=" flex justify-around font-PeydaBold px-3">
          <h1>{t("rent.homePage")}</h1>
          <h1>{t("rent.aboutUs")}</h1>
          <h1>{t("rent.support")}</h1>
          <h1>{t("rent.contactUs")}</h1>
        </div>
      </div>
    </div>
  );
}

export default Footer;
