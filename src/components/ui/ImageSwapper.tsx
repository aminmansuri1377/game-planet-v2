import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import Image from "next/image";
import Loading from "./Loading";

// import img1 from "../../../public/images/p1.webp";
// import img2 from "../../../public/images/p2.webp";
// import img3 from "../../../public/images/p3.webp";

// const images = [img1, img2, img3];

function ImageSwapper({ images }: { images: { images: string[] } | string[] }) {
  // console.log("imagess", imagess.images);
  // console.log("images", images);
  if (!images) {
    return (
      <div className="w-full max-w-lg mx-auto flex items-center justify-center bg-gray-100 rounded-2xl shadow-lg h-64">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }
  if (Array.isArray(images) && images.length === 0) {
    return (
      <div className="w-full max-w-lg mx-auto flex items-center justify-center bg-gray-100 rounded-2xl shadow-lg h-64">
        <p className="text-gray-500">No images available</p>
      </div>
    );
  }

  const imageArray = Array.isArray(images) ? images : images.images;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [loadedImages, setLoadedImages] = useState<boolean[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageArray.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageArray.length - 1 ? 0 : prevIndex + 1
    );
  };
  const handleImageLoad = (index: number) => {
    setLoadedImages((prev) => {
      const newLoadedImages = [...prev];
      newLoadedImages[index] = true;
      return newLoadedImages;
    });

    // Check if all images are loaded
    if (loadedImages.every((loaded) => loaded)) {
      setIsLoading(false);
    }
  };
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/50">
          <Loading />
        </div>
      )}
      {/* Image Container */}
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <div className="flex justify-center mb-1 space-x-2">
          {imageArray &&
            imageArray.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-5 h-1 rounded-md transition-all ${
                  currentIndex === index
                    ? "bg-blue-500 scale-125"
                    : "bg-gray-400"
                }`}
              />
            ))}
        </div>
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {imageArray.map((image, index) => (
            <div key={index} className="min-w-full">
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                className="w-full h-auto object-cover"
                width={200}
                height={100}
                loading="lazy"
                onLoadingComplete={() => handleImageLoad(index)}
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
