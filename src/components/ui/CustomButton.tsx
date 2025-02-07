import { FC, ReactNode } from "react"            
                                         import { useTranslation } from "react-i18next";;
import Spinner from "./Spinner";

interface IButtonProps {
  loading?: boolean;
  type:
    | "primary-btn"
    | "simple-btn"
    | "secondary-btn"
    | "success-btn"
    | "border-btn"
    | "alert-btn"
    | "purple-btn"
    | "border-purple-btn"
    | "line-btn"
    | "text-btn"
    | "border-purpleBtn-whiteText"
    | "line-btn-small";
  title: ReactNode | string;
  onClick?: any;
  className?: string;
  disabled?: boolean;
}

const CustomButton: FC<IButtonProps> = ({
  loading,
  type,
  title,
  onClick,
  className,
  disabled,
}) => {
  const [
    primaryBtn,
    simpleButton,
    secondaryBtn,
    successBtn,
    borderBtn,
    alertBtn,
    purpleBtn,
    borderPurpleBtn,
    lineBtn,
    textBtn,
    borderPurpleBtnWhiteText,
    lineBtnSmall,
  ] = [
    type === "primary-btn",
    type === "simple-btn",
    type === "secondary-btn",
    type === "success-btn",
    type === "border-btn",
    type === "alert-btn",
    type === "purple-btn",
    type === "border-purple-btn",
    type === "line-btn",
    type === "text-btn",
    type === "border-purpleBtn-whiteText",
    type === "line-btn-small",
  ];

  return (
    <button
      className={`rounded-2xl m-2 py-2 px-10 font-PeydaBold ${
        primaryBtn && "bg-gradient-to-r from-[#3147BB] to-[#8000FF] text-white "
      } ${simpleButton && "bg-light-A dark:bg-dark-C "}${
        secondaryBtn &&
        "bg-metal drop-shadow-btn dark:shadow-btn border border-light-C"
      } ${successBtn && "border-grad-success bg-success"}} ${
        borderBtn && "border-grad-btn bg-selected"
      } ${alertBtn && "border-grad-alert bg-alert !rounded-[30px]"} ${
        purpleBtn && "bg-ctg-btn text-white px-5 shadow-btn"
      } ${
        lineBtn &&
        "rounded-2xl border border-light-C py-2 px-4 dark:text-white cursor-pointer text-sm"
      } ${
        lineBtnSmall &&
        "rounded-lg border border-light-C py-2 px-3 dark:text-white cursor-pointer text-xs"
      } ${
        borderPurpleBtn &&
        "bg-gradient-to-r from-[#3147BB] to-[#8000FF] border-4 border-[#3a7efd] text-white  "
      } ${
        borderPurpleBtnWhiteText &&
        " border-[1px] border-grad-ctg text-transparent "
      }  ${textBtn && "bg-alert text-lg sm:text-xl"} ${className}`}
      onClick={onClick}
      disabled={loading || disabled}
    >
      {loading ? <Spinner /> : title}
    </button>
  );
};

export default CustomButton;
