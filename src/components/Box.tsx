import { FC, ReactNode } from "react"        
                                             import { useTranslation } from "react-i18next";;

type BoxProps = {
  children: ReactNode;
  lessPaddingY?: boolean;
  className?: any;
};
const Box: FC<BoxProps> = ({ children, lessPaddingY, className }) => {
  return (
    <div
      className={`relative ${
        lessPaddingY ? " py-2 my-2" : "py-10  my-10"
      } px-2 md:px-12 rounded-2xl shadow-lg text-center
     bg-white bg-opacity-10 border-2 border-transparent border-purple-800 + ${className}`}
    >
      {children}
    </div>
  );
};

export default Box;
