import Header from "@/components/Header";
import CustomButton from "@/components/ui/CustomButton";
import ProductCard from "@/components/ui/ProductCard";
import React from "react";
import ProductImg from "../../public/images/p2.webp";
import ProductImg2 from "../../public/images/x3.jpg";

function newDesign() {
  const handleSave = () => {};
  return (
    <div className=" min-h-screen">
      <Header />
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
