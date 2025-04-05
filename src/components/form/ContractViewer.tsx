import React from "react";
import { useTranslation } from "react-i18next";
import Box from "../Box";
import { trpc } from "../../../utils/trpc";

function ContractViewer({ orderId }) {
  const { t } = useTranslation();
  console.log("orderId", orderId);
  const { data: order, isLoading: isOrderLoading } =
    trpc.main.getOrderById.useQuery(
      { id: Number(orderId) },
      { enabled: !!orderId }
    );
  console.log("order", order);
  if (isOrderLoading) return <div>Loading contract...</div>;

  return (
    <Box>
      {order && (
        <div>
          <h2 className="font-PeydaBold text-center mb-4">متن قرارداد</h2>
          <div className="space-y-4">{order && order.id}</div>
          <div>
            {order?.status === "waiting for confirmation" ? (
              <div>
                <div className="my-5 text-right font-PeydaRegular">
                  <h1>
                    اجاره گیرنده {order.user.firstName} {order.user.lastName} به
                    شماره ملی {order.user.IDnumber} به شماره همراه{" "}
                    {order.user.phone}
                  </h1>
                  <h1> {order.product.name}کالای</h1>
                  <h1>
                    را از ناریخ {order.startDate} تا تاریخ {order.endDate} به
                    قیمت نهایی {order.totalPrice} از اجاره دهنده{" "}
                    {order.seller.firstName} {order.seller.lastName} به شماره
                    ملی {order.seller.IDnumber} به شماره همراه{" "}
                    {order.seller.phone}
                  </h1>
                  <h1> میخواهد اجاره بگیرد</h1>
                </div>
              </div>
            ) : order?.status === "confirmed and sent" ? (
              <div>
                <div className="my-5 text-right font-PeydaRegular">
                  <h1>
                    اجاره دهنده {order.seller.firstName} {order.seller.lastName}{" "}
                    به شماره ملی {order.seller.IDnumber} به شماره همراه{" "}
                    {order.seller.phone}
                  </h1>
                  <h1>{order.product.name}قبول کرده که کالای </h1>
                  <h1>
                    را از ناریخ {order.startDate} تا تاریخ {order.endDate} به
                    قیمت نهایی {order.totalPrice}
                    به اجاره گیرنده {order.user.firstName} {order.user.lastName}{" "}
                    به شماره ملی {order.user.IDnumber} به شماره همراه{" "}
                    {order.user.phone}
                  </h1>
                </div>
              </div>
            ) : order?.status === "delivered" ? (
              <div>
                {" "}
                <div className="my-5 text-right font-PeydaRegular">
                  <h1>
                    اجاره گیرنده {order.user.firstName} {order.user.lastName} به
                    شماره ملی {order.user.IDnumber} به شماره همراه{" "}
                    {order.user.phone}
                  </h1>
                  <h1>{order.product.name} کالای</h1>
                  <h1>
                    را از ناریخ {order.startDate} تا تاریخ {order.endDate} به
                    قیمت نهایی {order.totalPrice} از اجاره دهنده{" "}
                    {order.seller.firstName} {order.seller.lastName} به شماره
                    ملی {order.seller.IDnumber} به شماره همراه{" "}
                    {order.seller.phone}
                  </h1>
                  به صورت سالم تحویل گرفته و تایید کرده که کالا سالم بوده و
                  درحال استفاده از محصول میباشد
                </div>
              </div>
            ) : order?.status === "taken back" ? (
              <div>
                <div className="my-5 text-right font-PeydaRegular">
                  <h1>
                    اجاره دهنده {order.seller.firstName} {order.seller.lastName}{" "}
                    به شماره ملی {order.seller.IDnumber} به شماره همراه{" "}
                    {order.seller.phone}
                  </h1>
                  <h1>{order.product.name}کالای</h1>
                  <h1>
                    را از ناریخ {order.startDate} تا تاریخ {order.endDate} به
                    قیمت نهایی {order.totalPrice}
                    را از اجاره گیرنده {order.user.firstName}{" "}
                    {order.user.lastName} به شماره ملی {order.user.IDnumber} به
                    شماره همراه {order.user.phone}
                  </h1>
                  <h1>
                    سالم پس گرفته و تایید کرده و این قرارداد اجاره به پایان
                    رسیده
                  </h1>
                </div>
              </div>
            ) : (
              ""
            )}
            <h1>این سفارش دارای تضمین {order.product.guarantyId}</h1>
            <h1>این سفارش باید به آدرس {order.address} برود</h1>
            <h1>و نوع تحویل کالا {order.sendingType} میباشد</h1>
          </div>
        </div>
      )}
    </Box>
  );
}

export default ContractViewer;
