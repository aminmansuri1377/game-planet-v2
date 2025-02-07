import CustomButton from "@/components/ui/CustomButton";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect";
import Cookies from "js-cookie";
import { HiOutlineSquaresPlus } from "react-icons/hi2";

function Index() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleLogout = () => {
    Cookies.remove("dashboardAuth");
    router.push("/");
  };
  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className=" text-center mx-auto">
      <CustomButton
        title={t("rent.productCreation")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/createProduct")}
      />
      <CustomButton
        title={t("rent.products")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/products")}
      />
      <CustomButton
        title={t("rent.orders")}
        type="primary-btn"
        onClick={() => router.push("/dashboard/orders")}
      />
      <CustomButton
        title="users"
        type="primary-btn"
        onClick={() => router.push("/dashboard/users")}
      />
      <div className=" mt-20">
        <button
          className="bg-red-500 text-white py-2 px-4 rounded-lg font-PeydaBold"
          onClick={handleLogout}
        >
          {t("rent.logout")}
        </button>
      </div>
    </div>
  );
}

export default Index;
