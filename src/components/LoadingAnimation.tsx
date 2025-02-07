import { useTranslation } from "react-i18next";

const LoadingAnimation = () => {
  const { t } = useTranslation();

  return (
    <div className="relative flex items-center justify-center min-h-screen ">
      <>
        <div className="absolute bg-white bg-opacity-20 w-24 h-24 rounded-full animate-pulse floating-1"></div>
        <div className="absolute bg-white bg-opacity-30 w-20 h-20 rounded-full animate-pulse floating-2"></div>
        <div className="absolute bg-white bg-opacity-25 w-32 h-32 rounded-full animate-pulse floating-3"></div>

        <div className="absolute w-48 h-48 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-expand"></div>

        <div className="relative z-10 text-white text-4xl font-extrabold opacity-0 animate-fadeIn">
          {t("welcome.letsgo")}
        </div>

        <div className="absolute inset-0 overflow-hidden">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
        </div>
      </>
    </div>
  );
};

export default LoadingAnimation;
