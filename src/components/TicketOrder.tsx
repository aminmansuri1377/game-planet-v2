import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import Box from "./Box";
import DateObject from "react-date-object";
import persian from "react-date-object/calendars/persian";
import persian_fa from "react-date-object/locales/persian_fa";
import { FaCircleCheck } from "react-icons/fa6";
import { MdErrorOutline } from "react-icons/md";
import { MdDeliveryDining } from "react-icons/md";
import { MdSettingsBackupRestore } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import OrderTicketDetail from "./ui/OrderTicketDetail";
import OrderTicketStatus from "./ui/OrderTicketStatus";
import { IoMdArrowDropdown } from "react-icons/io";
import { IoMdArrowDropup } from "react-icons/io";

function TicketOrder({ data, handleStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const readDateOrder = new DateObject({
    date: data?.createdAt,
    calendar: persian,
    locale: persian_fa,
  });
  return (
    <div>
      <Box lessPaddingY>
        <div className="flex justify-between">
          <h2>{data.userEmail}</h2>
          <h2>{data.username}</h2>
          <h2>:کاربر</h2>
        </div>
      </Box>
      <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
        {isOpen ? (
          <IoMdArrowDropup size={30} color="white" />
        ) : (
          <IoMdArrowDropdown size={30} color="white" />
        )}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="flex w-full justify-between">
          <div className=" w-4/5">
            <h1 className="mx-1 font-PeydaBold text-sm my-3">
              {t("rent.status")}
            </h1>
            <OrderTicketStatus
              Icon={MdErrorOutline}
              text={t("rent.awaitingConfirmation")}
              isActive={data?.status === "waiting for confirmation"}
              handleClick={() =>
                handleStatusChange(data.id, "waiting for confirmation")
              }
            />
            <OrderTicketStatus
              Icon={MdDeliveryDining}
              text={t("rent.sent")}
              isActive={data?.status === "confirmed and sent"}
              handleClick={() =>
                handleStatusChange(data.id, "confirmed and sent")
              }
            />
            <OrderTicketStatus
              Icon={FaCircleCheck}
              text={t("rent.delivered")}
              isActive={data?.status === "delivered"}
              handleClick={() => handleStatusChange(data.id, "delivered")}
            />
            <OrderTicketStatus
              Icon={MdSettingsBackupRestore}
              text={t("rent.takenBack")}
              isActive={data?.status === "taken back"}
              handleClick={() => handleStatusChange(data.id, "taken back")}
            />
            <OrderTicketStatus
              Icon={MdCancel}
              text={t("rent.canceled")}
              isActive={data?.status === "denied"}
              handleClick={() => handleStatusChange(data.id, "denied")}
            />
          </div>
          <div className=" ml-5">
            <OrderTicketDetail
              value={readDateOrder.format("dddd DD MMMM YYYY ، hh:mm ")}
              text={""}
            />
            <OrderTicketDetail
              value={data.productName}
              text={t("rent.product")}
            />
            <OrderTicketDetail
              value={data.cotrollers}
              text={t("rent.controllerQuantity")}
            />
            <OrderTicketDetail
              value={data.nights}
              text={t("rent.nightQuantity")}
            />
            <OrderTicketDetail value={data.finalPrice} text={t("rent.price")} />
            <OrderTicketDetail
              value={data.packageId}
              text={t("rent.package")}
            />
          </div>
        </div>
        {data.installation && (
          <div className="w-full bg-slate-400 bg-opacity-50 rounded-lg p-2 items-center">
            <h1 className=" font-PeydaBold">{t("rent.address")}</h1>
          </div>
        )}
      </div>
    </div>
  );
}

export default TicketOrder;
