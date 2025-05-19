import { memo, FC } from "react";
import * as handLoading from "../../../public/lottie/handLoadingnew.json";
import dynamic from "next/dynamic";
// import Lottie from "react-lottie";
const Lottie = dynamic(() => import("react-lottie"), {
  ssr: false,
});

interface IProps {
  type?: string;
}

const Loading: FC<IProps> = ({ type }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: handLoading,
  };
  return (
    <div className=" h-screen mx-auto ">
      <Lottie options={defaultOptions} height={250} width={250} />{" "}
    </div>
  );
};

export default memo(Loading);
