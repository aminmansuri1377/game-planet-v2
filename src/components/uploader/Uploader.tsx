"use client";

import { ChangeEvent, useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { uploadImage } from "../../../supabase/storage/client";
import CustomButton from "../ui/CustomButton";
import { CiImageOn } from "react-icons/ci";

function Uploader({
  onUpload,
  singleUpload = false,
  bucket,
  setUploaded,
}: {
  onUpload: (urls: string[]) => void;
  singleUpload?: boolean;
  bucket?: string;
  setUploaded;
}) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
    }
  };

  const [isPending, startTransition] = useTransition();

  const handleClickUploadImagesButton = async () => {
    startTransition(async () => {
      let urls = [];
      for (const url of imageUrls) {
        const imageFile = await convertBlobUrlToFile(url);

        const { imageUrl, error } = await uploadImage({
          file: imageFile,
          bucket: bucket,
        });

        if (error) {
          console.error(error);
          return;
        }

        urls.push(imageUrl);
      }

      console.log(urls);
      setImageUrls([]);
      onUpload(urls);
      setUploaded(true);
    });
  };

  // Function to handle deleting an image
  const handleDeleteImage = (urlToDelete: string) => {
    setImageUrls(imageUrls.filter((url) => url !== urlToDelete));
  };
  console.log("imageUrls", imageUrls);
  return (
    <div className="bg-transparent border-2 border-primary m-5 rounded-xl flex justify-center items-center flex-col gap-4">
      <input
        type="file"
        hidden
        multiple={!singleUpload}
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />
      <CustomButton
        type="secondary-btn"
        title="انتخاب عکس"
        onClick={() => imageInputRef.current?.click()}
      />
      {!imageUrls || (imageUrls.length === 0 && <CiImageOn size={40} />)}
      {/* <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => imageInputRef.current?.click()}
        disabled={isPending}
      >
        Select Images
      </button> */}

      <div className="m-2">
        {imageUrls.map((url, index) => (
          <div key={url} className="relative">
            <Image src={url} width={300} height={300} alt={`img-${index}`} />
            {/* Delete button */}
            <button
              onClick={() => handleDeleteImage(url)}
              className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
            >
              X
            </button>
          </div>
        ))}
      </div>
      <CustomButton
        type="primary-btn"
        title={isPending ? "Uploading..." : "بارگذاری عکس"}
        disabled={isPending}
        onClick={handleClickUploadImagesButton}
      />
    </div>
  );
}

export default Uploader;
