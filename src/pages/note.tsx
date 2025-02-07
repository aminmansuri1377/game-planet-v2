import CustomButton from "@/components/ui/CustomButton";
import React from "react";
import { useTranslation } from "react-i18next";

function note() {
  const { t } = useTranslation();
  return (
    <div className=" w-full">
      <CustomButton title="boooobs" type="primary-btn" className=" m-5" />
      <CustomButton
        title="boooobs"
        type="primary-btn"
        className=" m-5"
        disabled
      />
      <CustomButton
        title="boooobs"
        type="primary-btn"
        className=" m-5"
        loading
      />
      <CustomButton title="boooobs" type="border-purple-btn" className=" m-5" />
    </div>
  );
}

export default note;
