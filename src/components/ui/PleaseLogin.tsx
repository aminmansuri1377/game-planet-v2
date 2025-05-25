import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";
import CustomButton from "./CustomButton";
import { useRouter } from "next/router";

function PleaseLogin({ handleBack }) {
  const router = useRouter();

  return (
    <div>
      {" "}
      <div className="min-h-screen font-PeydaBold my-20">
        <div onClick={handleBack} className="m-5">
          <FaArrowLeftLong />
        </div>
        <div>لطفا وارد شوید</div>
        <CustomButton
          onClick={() => router.push("/")}
          title={<IoHomeOutline size={20} />}
          type="primary-btn"
        />
      </div>
    </div>
  );
}

export default PleaseLogin;
