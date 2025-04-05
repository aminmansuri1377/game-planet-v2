import { memo, FC } from "react";
import * as handLoading from "../../../public/lottie/handLoadingnew.json";
import Lottie from "react-lottie";

interface IProps {
  type?: string;
}

const Spinner: FC<IProps> = ({ type }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: handLoading,
  };
  return (
    <div className="mx-auto">
      <Lottie options={defaultOptions} height={250} width={250} />{" "}
    </div>
  );
};

export default memo(Spinner);
