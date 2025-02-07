import { memo, FC } from "react"                             
                        import { useTranslation } from "react-i18next";;
import * as buttonLoading from "../../../public/lottie/buttonLoading.json";
import Lottie from "react-lottie";

interface IProps {
  type?: string;
}

const Spinner: FC<IProps> = ({ type }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: buttonLoading,
  };
  return (
    <div className="mx-auto">
      <Lottie options={defaultOptions} height={25} width={50} />{" "}
    </div>
  );
};

export default memo(Spinner);
