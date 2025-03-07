import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import img1 from "../../../public/images/p1.webp";
import img2 from "../../../public/images/p2.webp";
import img3 from "../../../public/images/p3.webp";

const images = [img1, img2, img3];

function ImageSwapper() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Image Container */}
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div className="flex justify-center mb-1 space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-5 h-1 rounded-md transition-all ${
                currentIndex === index ? "bg-blue-500 scale-125" : "bg-gray-400"
              }`}
            />
          ))}
        </div>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {images.map((image, index) => (
            <div key={index} className="min-w-full">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Left Arrow */}
      <button
        className="absolute top-1/2 left-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        onClick={prevSlide}
      >
        <FaChevronLeft size={20} />
      </button>

      {/* Right Arrow */}
      <button
        className="absolute top-1/2 right-2 -translate-y-1/2 bg-black/40 text-white p-2 rounded-full hover:bg-black/60 transition"
        onClick={nextSlide}
      >
        <FaChevronRight size={20} />
      </button>

      {/* Dots Navigation */}
    </div>
  );
}

export default ImageSwapper;
