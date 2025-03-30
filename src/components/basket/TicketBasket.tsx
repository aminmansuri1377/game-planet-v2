import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "../Box";
import { FaCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { MdDeliveryDining } from "react-icons/md";
import { MdSettingsBackupRestore } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import CustomButton from "../ui/CustomButton";
import jalaali from "jalaali-js";
import Image from "next/image";
import CustomModal from "../ui/CustomModal";
import { FaMapLocationDot } from "react-icons/fa6";
import dynamic from "next/dynamic";
import ContractViewer from "../form/ContractViewer";
import { LiaFileContractSolid } from "react-icons/lia";

const Map = dynamic(() => import("@/components/MyMap"), {
  ssr: false,
});
function TicketBasket({ data, handleStatusChange }) {
  const readDateOrder = new DateObject({
    date: data?.createdAt,
    calendar: persian,
    locale: persian_fa,
  });
  const [open, setOpen] = useState(false);
  const [showLoc, setShowLoc] = useState(false);
  const [showCon, setShowCon] = useState(false);
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState([35.6892, 51.389]);
  const [selectedOrderId, setSelectedOrderId] = useState(0);

  const { t } = useTranslation();
  const gregorianToPersian = (date: Date): string => {
    const gregorianDate = new Date(date);
    const { jy, jm, jd } = jalaali.toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1, // Months are 0-based in JS
      gregorianDate.getDate()
    );
    return `${jy}/${jm}/${jd}`; // Format: YYYY/MM/DD
  };
  const closeModal = () => {
    setShowLoc(false);
  };
  const openModal = (lat, lang, add) => {
    setShowLoc(true);
    setPosition([lat, lang]);
    setAddress(add);
  };
  const closeModalCon = () => {
    setShowCon(false);
    setSelectedOrderId(0);
  };
  const openModalCon = (id) => {
    setShowCon(true);
    setSelectedOrderId(id);
  };
  return (
    <div className=" bg-cardbg m-3 rounded-lg">
      {data && (
        <div>
          <div className="">
            <div>
              {data?.product?.images && (
                <Image
                  src={data?.product?.images[0]}
                  alt={data?.id}
                  width={150}
                  height={150}
                  className=" rounded-t-lg w-full"
                />
              )}
            </div>
            <div>
              <div
                className={` ${open ? "text-center" : "text-end"} mx-3 my-3`}
              >
                <h2 className="font-PeydaBold">{data?.product?.name}</h2>
              </div>

              <div
                className={`flex ${
                  open ? "justify-center" : "justify-end"
                } mx-3`}
              >
                {data?.status === "waiting for confirmation" ? (
                  <div className=" flex justify-end">
                    <MdErrorOutline
                      size={20}
                      className="mx-auto"
                      color="yellow"
                    />
                    <h1 className=" font-PeydaBold text-yellow-300 text-md">
                      {t("rent.awaitingConfirmation")}
                    </h1>
                    <h1 className=" font-PeydaBold">:{t("rent.status")}</h1>
                  </div>
                ) : data?.status === "confirmed and sent" ? (
                  <div>
                    <div className=" flex justify-end">
                      <MdDeliveryDining size={20} className="" color="blue" />
                      <h1 className=" font-PeydaBold text-blue-400 text-md">
                        {t("rent.sent")}
                      </h1>

                      <h1 className=" font-PeydaBold">:{t("rent.status")}</h1>
                    </div>
                    <div className=" bg-secondary rounded-md p-4 m-4">
                      <h1 className=" font-PeydaBold ">
                        آیا محصول را سالم تحویل گرفتید ؟{" "}
                      </h1>
                      <CustomButton
                        type="primary-btn"
                        title="بله"
                        onClick={() => handleStatusChange(data.id, "delivered")}
                      />
                    </div>
                  </div>
                ) : data?.status === "delivered" ? (
                  <div className=" flex justify-end">
                    <FaCircleCheck size={20} className="" color="lightGreen" />
                    <h1 className=" font-PeydaBold text-green-400 text-md">
                      {t("rent.delivered")}
                    </h1>
                    <h1 className=" font-PeydaBold">:{t("rent.status")}</h1>
                  </div>
                ) : data?.status === "taken back" ? (
                  <div className=" flex justify-end">
                    <MdSettingsBackupRestore
                      size={20}
                      className=""
                      color="black"
                    />
                    <h1 className=" font-PeydaBold text-black text-md">
                      {t("rent.takenBack")}
                    </h1>
                    <h1 className=" font-PeydaBold">:{t("rent.status")}</h1>
                  </div>
                ) : data?.status === "denied" ? (
                  <div className=" flex justify-end">
                    <MdCancel size={20} className="" color="red" />
                    <h1 className=" font-PeydaBold text-red-600 text-md">
                      {t("rent.canceled")}
                    </h1>
                    <h1 className=" font-PeydaBold">:{t("rent.status")}</h1>
                  </div>
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          {open && (
            <div>
              <FaMapLocationDot
                size={40}
                className=" mx-auto my-4"
                onClick={() =>
                  openModal(
                    data?.product?.latitude,
                    data?.product?.longitude,
                    data?.product?.address
                  )
                }
              />
              <LiaFileContractSolid
                size={40}
                className=" mx-auto my-4"
                onClick={() => openModalCon(data?.id)}
              />
              <div className="grid grid-cols-2 gap-2 mx-2">
                <Box lessPaddingY>
                  <div className="flex justify-between">
                    <h2 className="font-PeydaBold">{data?.totalPrice}</h2>
                    <h2 className="font-PeydaBold">:{t("rent.totalPrice")}</h2>
                  </div>
                </Box>
                <Box lessPaddingY>
                  <div className="flex justify-between">
                    <h2 className="font-PeydaBold">{data?.quantity}</h2>
                    <h2 className="font-PeydaBold">:تعداد</h2>
                  </div>
                </Box>
                <Box lessPaddingY>
                  <div className=" mx-auto">
                    <h2 className="font-PeydaBold">:تاریخ ثبت</h2>
                    <h2 className="font-PeydaBold text-xs">
                      {readDateOrder.format("dddd DD MMMM YYYY ، hh:mm ")}
                    </h2>
                  </div>
                </Box>
                <Box lessPaddingY>
                  <div className="flex justify-between">
                    <h2 className="font-PeydaBold">{data?.sendingType}</h2>
                    <h2 className="font-PeydaBold">:نوع تحویل</h2>
                  </div>
                </Box>
                <Box lessPaddingY>
                  <div className="flex justify-between">
                    <h2 className="font-PeydaBold">
                      {gregorianToPersian(new Date(data?.startDate))}
                    </h2>
                    <h2 className="font-PeydaBold">:شروع</h2>
                  </div>
                </Box>
                <Box lessPaddingY>
                  <div className="flex justify-between">
                    <h2 className="font-PeydaBold">
                      {gregorianToPersian(new Date(data?.endDate))}
                    </h2>
                    <h2 className="font-PeydaBold">:اتمام</h2>
                  </div>
                </Box>
              </div>
            </div>
          )}
          <h1
            className=" font-PeydaRegular text-center mt-4 text-blue-400 test-md"
            onClick={() => setOpen(!open)}
          >
            {open ? "مشاهده کمتر" : "مشاهده بیشتر"}
          </h1>
        </div>
      )}
      <CustomModal type="general" show={showLoc} onClose={closeModal}>
        {" "}
        <Map position={position} zoom={10} locations={[]} />
        <p className=" font-PeydaRegular">{address}</p>
      </CustomModal>
      <CustomModal type="general" show={showCon} onClose={closeModalCon}>
        <ContractViewer orderId={selectedOrderId} />
      </CustomModal>
    </div>
  );
}

export default TicketBasket;
