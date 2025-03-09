import { FC, ReactNode, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
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
    <div className="p-6">
      {show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40" />
      )}
      <div
        ref={modalRef}
        className={`fixed text-center top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-[18px] max-w-mobile w-11/12 p-2 z-50 ${
          !show && "hidden"
        } ${success && " border-2 border-green-600 bg-green-200 "} ${
          alert && " border-2 border-red-500 bg-red-200"
        } ${general && " border-2 border-primary bg-secondary"}`}
        style={{ maxHeight: "90vh", overflowY: "auto" }} // Enable scrolling
      >
        {/* Sticky Close Button */}
        <div
          className="sticky top-0 left-0 z-50 cursor-pointer flex justify-start p-2 bg-inherit"
          onClick={() => onClose()}
        >
          <IoIosCloseCircleOutline size={30} />
        </div>
        {/* Modal Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
