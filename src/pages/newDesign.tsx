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
      <ImageSwapper />
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
      <ProductCard
        imgUrl={ProductImg}
        imgAlt="a"
        name="یه دوربین خیلی خفن"
        info="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از ..."
        handleSave={handleSave}
        isSaved={true}
        rate={9.5}
      />
      <ProductCard
        imgUrl={ProductImg2}
        imgAlt="a"
        name="یه دوربین خیلی خفن"
        info="لورم ایپسوم متن ساختگی با تولید سادگی نامفهوم از ..."
        handleSave={handleSave}
        isSaved={false}
        rate={8}
      />
    </div>
  );
}

export default newDesign;
