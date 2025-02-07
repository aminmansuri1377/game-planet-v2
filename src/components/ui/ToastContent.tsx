import { FC, ReactNode } from "react";

interface IProps {
  type: "success" | "error" | "general";
  message?: string;
  icon?: ReactNode;
}

const ToastContent: FC<IProps> = ({ type, message, icon }) => {
  const [success, error] = [
    type === "success",
    type === "error",
    type === "general",
  ];

  function checkDefultMessage(type) {
    switch (type) {
      case "success":
        return "انجام شد.";
      case "error":
        return "مشکلی به وجود آمده است.";
      default:
        return "";
    }
  }

  return (
    <div
      className={`flex flex-col justify-center items-center w-full max-w-mobile sm:w-2/5 rounded-2xl px-6 sm:px-10 py-5 sm:py-8 border ${
        success && "border-2 border-green-600 bg-green-300"
      } ${error && "border-2 border-red-700 bg-red-400"} `}
    >
      {icon}
      <div className={`${icon && "mt-3 sm:mt-5"} text-center`}>
        <h1 className="    text-base sm:text-xl">
          {message ? message : checkDefultMessage(type)}
        </h1>
      </div>
    </div>
  );
};

export default ToastContent;
