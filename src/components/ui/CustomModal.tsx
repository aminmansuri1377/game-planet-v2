import { FC, ReactNode, useEffect, useRef } from "react"                  
                                   import { useTranslation } from "react-i18next";;
import { IoIosCloseCircleOutline } from "react-icons/io";

interface IProps {
  show: boolean;
  type: string;
  children: ReactNode;
  onClose: any;
}

const CustomModal: FC<IProps> = ({ type, show, children, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null); // Reference to the modal

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show, onClose]);

  const [success, alert, general] = [
    type === "success",
    type === "alert",
    type === "general",
  ];

  return (
    <>
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
      )}
      <div
        ref={modalRef}
        className={`fixed text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[18px] max-w-mobile w-11/12 p-2 z-50 ${
          !show && "hidden"
        } ${success && " border-2 border-green-600 bg-green-200 "} ${
          alert && " border-2 border-red-500 bg-red-200"
        } ${general && " border-2 border-purple-900 bg-purple-700"}`}
      >
        <div
          className=" left-3 top-3 z-200 cursor-pointer md:left-14 md:top-5"
          onClick={() => onClose()}
        >
          <IoIosCloseCircleOutline size={30} />
        </div>
        {children}
      </div>
    </>
  );
};

export default CustomModal;
