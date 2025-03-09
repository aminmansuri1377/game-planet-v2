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
import CustomButton from "./ui/CustomButton";
import { trpc } from "../../utils/trpc";

function TicketOrder({ data, handleStatusChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();

  const readDateOrder = new DateObject({
    date: data?.createdAt,
    calendar: persian,
    locale: persian_fa,
  });

  const increaseInventoryMutation =
    trpc.main.increaseProductInventory.useMutation({
      onSuccess: () => {
        alert("Inventory increased successfully!");
      },
      onError: (error) => {
        alert(`Error: ${error.message}`);
      },
    });

  const handleIncreaseInventory = (productId) => {
    increaseInventoryMutation.mutate({ productId });
  };
  const towActionHandler = (id, status) => {
    handleStatusChange(id, status), handleIncreaseInventory(id);
  };
  return (
    <div className=" bg-cardbg rounded-xl">
      <Box lessPaddingY>
        <div className="flex justify-between">
          <h2>{data?.userEmail}</h2>
          <h2>{data?.username}</h2>
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
            {data?.status === "waiting for confirmation" && (
              <div>
                <OrderTicketStatus
                  Icon={MdErrorOutline}
                  text={t("rent.awaitingConfirmation")}
                  isActive="waiting for confirmation"
                />
                <div>
                  <h1>do you accept?</h1>
                  <CustomButton
                    type="primary-btn"
                    title="yes"
                    onClick={() =>
                      handleStatusChange(data?.id, "confirmed and sent")
                    }
                  />
                  <CustomButton
                    type="alert-btn"
                    title="no"
                    onClick={() => towActionHandler(data?.id, "denied")}
                  />
                </div>
              </div>
            )}
            {data?.status === "confirmed and sent" && (
              <div>
                <OrderTicketStatus
                  Icon={MdDeliveryDining}
                  text={t("rent.sent")}
                  isActive="confirmed and sent"
                />
              </div>
            )}
            {data?.status === "delivered" && (
              <div>
                <OrderTicketStatus
                  Icon={FaCircleCheck}
                  text={t("rent.delivered")}
                  isActive="delivered"
                />
                <div>
                  <h1>do you take it back correct?</h1>
                  <CustomButton
                    type="primary-btn"
                    title="yes"
                    onClick={() => handleStatusChange(data?.id, "taken back")}
                  />
                </div>
              </div>
            )}
            {data?.status === "taken back" && (
              <div>
                <OrderTicketStatus
                  Icon={MdSettingsBackupRestore}
                  text={t("rent.takenBack")}
                  isActive="taken back"
                />
                <div>do you want to add it to Warehouse?</div>
                <CustomButton
                  type="primary-btn"
                  title="yes"
                  onClick={() => towActionHandler(data?.id, "taken back")}
                />
              </div>
            )}
            {data?.status === "denied" && (
              <OrderTicketStatus
                Icon={MdCancel}
                text={t("rent.canceled")}
                isActive="denied"
              />
            )}
          </div>
          <div className=" ml-5">
            <OrderTicketDetail
              value={readDateOrder.format("dddd DD MMMM YYYY ، hh:mm ")}
              text={""}
            />
            <OrderTicketDetail
              value={data?.productName || ""}
              text={t("rent.product")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TicketOrder;
