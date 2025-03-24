import React from "react";
import Hd from "../../../public/images/hd.png";
import Image from "next/image";

function HeadOfPages({ title, icon, back }) {
  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Background Image */}
      <div style={{ position: "relative" }}>
        <Image
          src={Hd}
          className=" rounded-b-3xl"
          alt="hd"
          width={500} // Set the actual width of the image
          height={300} // Set the actual height of the image
        />
      </div>

      {/* Overlay Content */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 2,
          width: "100%",
          height: "100%",
        }}
        className=" text-center"
      >
        <div>
          <div>{back}</div>
          <h1 className=" font-PeydaBlack text-text1 text-2xl mt-[-20px]">
            {title}
          </h1>
        </div>
        <div className=" mt-10">{icon}</div>
      </div>
    </div>
  );
}

export default HeadOfPages;
