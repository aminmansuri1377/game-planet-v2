import React from "react";
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

function TicketBasket({ data }) {
  const readDateOrder = new DateObject({
    date: data?.createdAt,
    calendar: persian,
    locale: persian_fa,
  });
  const { t } = useTranslation();

  return (
    <div className="">
      {data && (
        <div>
          <div className="flex justify-evenly my-8">
            <Box lessPaddingY>
              <h1 className="mx-7 font-PeydaBold">{t("rent.status")}</h1>
              {data?.status === "waiting for confirmation" ? (
                <div>
                  <MdErrorOutline
                    size={50}
                    className=" my-3 mx-auto"
                    color="yellow"
                  />
                  <h1 className=" font-PeydaBold text-yellow-300">
                    {t("rent.awaitingConfirmation")}
                  </h1>
                </div>
              ) : data?.status === "confirmed and sent" ? (
                <div>
                  <MdDeliveryDining
                    size={50}
                    className=" my-3 mx-auto"
                    color="blue"
                  />
                  <h1 className=" font-PeydaBold text-blue-400">
                    {t("rent.sent")}
                  </h1>
                </div>
              ) : data?.status === "delivered" ? (
                <div>
                  <FaCircleCheck
                    size={50}
                    className=" my-3 mx-auto"
                    color="lightGreen"
                  />
                  <h1 className=" font-PeydaBold text-green-400">
                    {t("rent.delivered")}
                  </h1>
                </div>
              ) : data?.status === "taken back" ? (
                <div>
                  <MdSettingsBackupRestore
                    size={50}
                    className=" my-3 mx-auto"
                    color="black"
                  />
                  <h1 className=" font-PeydaBold text-black">
                    {t("rent.takenBack")}
                  </h1>
                </div>
              ) : data?.status === "denied" ? (
                <div>
                  <MdCancel size={50} className=" my-3 mx-auto" color="red" />
                  <h1 className=" font-PeydaBold text-red-600">
                    {t("rent.canceled")}
                  </h1>
                </div>
              ) : (
                ""
              )}
            </Box>
            <div>
              <Box lessPaddingY>
                <div className="flex justify-between">
                  <h2 className="font-PeydaBold">{data?.productName}</h2>
                  <h2 className="font-PeydaBold">:{t("rent.device")}</h2>
                </div>
              </Box>
              <Box lessPaddingY>
                <div className="flex justify-between">
                  <h2 className="font-PeydaBold">{data?.finalPrice}</h2>
                  <h2 className="font-PeydaBold">:{t("rent.totalPrice")}</h2>
                </div>
              </Box>
              <Box lessPaddingY>
                <div className=" mx-auto">
                  <h2 className="font-PeydaBold text-xs">
                    {readDateOrder.format("dddd DD MMMM YYYY ، hh:mm ")}
                  </h2>
                </div>
              </Box>
            </div>
          </div>
          <div className=" w-5/6 h-[1px] mx-auto rounded-full bg-slate-300 "></div>
        </div>
      )}
    </div>
  );
}

export default TicketBasket;
