import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import CustomButton from "./ui/CustomButton";
import ToastContent from "./ui/ToastContent";
import { toast } from "react-hot-toast";

function AdminPassModal({ onSuccess }) {
  const [password, setPassword] = useState("");

  const handlePasswordSubmit = () => {
    if (password.trim() === process.env.NEXT_PUBLIC_ADMINPASS) {
      onSuccess();
    } else {
      toast.custom(
        <ToastContent type="success" message="Incorrect password!" />
      );
    }
  };
  const { t } = useTranslation();

  return (
    <div className="">
      <div className="">
        <h2 className="text-lg text-black font-bold mb-4 font-PeydaBold">
          {t("rent.enterPassword")}
        </h2>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          className="border border-gray-300 text-black rounded-lg py-3 px-4 w-4/5 mx-auto my-2 text-end font-PeydaBold text-sm"
          type="password"
        />
        <CustomButton
          title={t("rent.login")}
          type="primary-btn"
          onClick={handlePasswordSubmit}
        />
      </div>
    </div>
  );
}

export default AdminPassModal;
