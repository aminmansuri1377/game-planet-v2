import Header from "@/components/Header";
import CustomButton from "@/components/ui/CustomButton";
import ProductCard from "@/components/ui/ProductCard";
import React, { useState } from "react";
import ProductImg from "../../public/images/p2.webp";
import ProductImg2 from "../../public/images/x3.jpg";
import ImageSwapper from "@/components/ui/ImageSwapper";
import { Input } from "@/components/ui/input";
import CustomDatePicker from "@/components/ui/CustomDatePicker";
import jalaali from "jalaali-js";
import TicketOrder from "@/components/TicketOrder";
import CommentCard from "@/components/ui/CommentCard";
import { TextAreaInput } from "@/components/ui/textAreaInput";
import Uploader from "@/components/uploader/Uploader";
const comment = {
  text: "لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از صنعت چاپ و با استفاده از طراحان گرافیک است",
  buyerId: "101",
};
const order = {
  buyer: { name: "امین", idNum: "002", phone: "0910" },
  seller: { name: "امید", idNum: "003", phone: "0910" },
  product: {
    start: "5",
    end: "6",
    finalPrice: "200",
    name: "ps5",
    guaranty: "گارانتی نوع1",
  },
  sendingType: "براش میبره",
  address: "یسبسیظلیبلیبذطذبایبلطبیبیا",
};
function newDesign() {
  const handleSave = () => {};
  const [rangeDate, setRangeDate] = useState<any>([]);

  const handleDateChange = (dates) => {
    const formattedDates = dates.map((date) => date?.format?.("YYYY-MM-DD"));
    setRangeDate(formattedDates);

    const startDate = formattedDates[0];
    const endDate = formattedDates[1];

    if (!(startDate instanceof Date) || !(endDate instanceof Date)) {
      console.error("Invalid date conversion:", { startDate, endDate });

      return;
    }
  };
  console.log("dates", rangeDate);
  return (
    <div className=" min-h-screen px-5">
      <Header />
      <div className=" my-10">
        <Uploader />
      </div>
      {/* <div className=" my-4">
        <TicketOrder />
      </div> */}
      <CommentCard comment={comment} />
      <ImageSwapper />/
      <div className="my-5 text-right font-PeydaRegular">
        <h1>
          اجاره گیرنده {order.buyer.name} به شماره ملی {order.buyer.idNum} به
          شماره همراه {order.buyer.phone}
        </h1>
        <h1> {order.product.name}کالای</h1>
        <h1>
          را از ناریخ {order.product.start} تا تاریخ {order.product.end} به قیمت
          نهایی {order.product.finalPrice} از اجاره دهنده {order.seller.name} به
          شماره ملی {order.seller.idNum} به شماره همراه {order.seller.phone}
        </h1>
        <h1> میخواهد اجاره بگیرد</h1>
        <h1>این سفارش دارای تضمین {order.product.guaranty}</h1>
        <h1>این سفارش باید به آدرس {order.address} برود</h1>
        <h1>و نوع تحویل کالا {order.sendingType} میباشد</h1>
      </div>
      <div className="my-5 text-right font-PeydaRegular">
        <h1>
          اجاره دهنده {order.seller.name} به شماره ملی {order.seller.idNum} به
          شماره همراه {order.seller.phone}
        </h1>
        <h1>{order.product.name}قبول کرده که کالای </h1>
        <h1>
          را از ناریخ {order.product.start} تا تاریخ {order.product.end} به قیمت
          نهایی {order.product.finalPrice}
          به اجاره گیرنده {order.buyer.name} به شماره ملی {order.buyer.idNum} به
          شماره همراه {order.buyer.phone}
        </h1>
        <h1>اجاره دهد و درحال اماده سازی و تحویل سفارش میباشد</h1>
        <h1>این سفارش دارای تضمین {order.product.guaranty}</h1>
        <h1>این سفارش باید به آدرس {order.address} برود</h1>
        <h1>و نوع تحویل کالا {order.sendingType} میباشد</h1>
      </div>
      <div className="my-5 text-right font-PeydaRegular">
        <h1>
          اجاره گیرنده {order.buyer.name} به شماره ملی {order.buyer.idNum} به
          شماره همراه {order.buyer.phone}
        </h1>
        <h1>{order.product.name} کالای</h1>
        <h1>
          را از ناریخ {order.product.start} تا تاریخ {order.product.end} به قیمت
          نهایی {order.product.finalPrice} از اجاره دهنده {order.seller.name} به
          شماره ملی {order.seller.idNum} به شماره همراه {order.seller.phone}
        </h1>
        به صورت سالم تحویل گرفته و تایید کرده که کالا سالم بوده و درحال استفاده
        از محصول میباشد
        <h1>این سفارش دارای تضمین {order.product.guaranty}</h1>
        <h1>این سفارش باید به آدرس {order.address} برود</h1>
        <h1>و نوع تحویل کالا {order.sendingType} میباشد</h1>
      </div>
      <div className="my-5 text-right font-PeydaRegular">
        <h1>
          اجاره دهنده {order.seller.name} به شماره ملی {order.seller.idNum} به
          شماره همراه {order.seller.phone}
        </h1>
        <h1>{order.product.name}کالای</h1>
        <h1>
          را از ناریخ {order.product.start} تا تاریخ {order.product.end} به قیمت
          نهایی {order.product.finalPrice}
          را از اجاره گیرنده {order.buyer.name} به شماره ملی {order.buyer.idNum}{" "}
          به شماره همراه {order.buyer.phone}
        </h1>
        <h1>سالم پس گرفته و تایید کرده و این قرارداد اجاره به پایان رسیده</h1>
        <h1> میخواهد اجاره بگیرد</h1>
        <h1>این سفارش دارای تضمین {order.product.guaranty}</h1>
        <h1>این سفارش باید به آدرس {order.address} برود</h1>
        <h1>و نوع تحویل کالا {order.sendingType} میباشد</h1>
      </div>
      /
      <CustomDatePicker
        range
        textBtn="بازه زمانی را مشخص کنید"
        value={rangeDate}
        onChange={handleDateChange}
        dateSeparator=" تا "
      />
      <TextAreaInput />
      <Input placeholder="نام و نام خانوادگی " />
      newDesign
      <CustomButton title="booobs" type="primary-btn" />
      <CustomButton title="booobs" type="secondary-btn" />
      <div className=" grid grid-cols-2 gap-2">
        <ProductCard
          imgUrl={ProductImg}
          imgAlt="a"
          name="یه دوربین خیلی خفن"
          price={1500000}
          handleSave={handleSave}
          isSaved={true}
          rate={4}
        />
        <ProductCard
          imgUrl={ProductImg2}
          imgAlt="a"
          name="یه دوربین خیلی خفن"
          price={1500000}
          handleSave={handleSave}
          isSaved={false}
          rate={5}
        />
      </div>
    </div>
  );
}
export const dynamic = "force-dynamic";

export default newDesign;
