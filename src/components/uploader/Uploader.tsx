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
  setUploaded?: (value: boolean) => void;
}) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isUploaded, setIsUploaded] = useState(false); // New state to track if upload is complete
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const newImageUrls = filesArray.map((file) => URL.createObjectURL(file));

      setImageUrls([...imageUrls, ...newImageUrls]);
      setIsUploaded(false); // Reset upload status when new images are selected
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

      setImageUrls([]);
      onUpload(urls);
      setUploaded?.(true);
      setIsUploaded(true); // Mark upload as complete
    });
  };

  const handleDeleteImage = (urlToDelete: string) => {
    setImageUrls(imageUrls.filter((url) => url !== urlToDelete));
    setIsUploaded(false); // Reset upload status when images are deleted
  };

  return (
    <div className="bg-transparent border-2 border-primary m-5 rounded-xl flex justify-center items-center flex-col gap-4">
      <input
        type="file"
        hidden
        multiple={!singleUpload}
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending || isUploaded} // Disable when uploading or already uploaded
      />

      {!isUploaded && (
        <CustomButton
          type="secondary-btn"
          title="انتخاب عکس"
          onClick={() => imageInputRef.current?.click()}
          disabled={isPending || isUploaded}
        />
      )}

      {/* Show different content based on state */}
      {isUploaded ? (
        <div className="text-green-500 font-bold">
          عکس‌ها با موفقیت آپلود شدند
        </div>
      ) : imageUrls.length === 0 ? (
        <CiImageOn size={40} />
      ) : (
        <div className="m-2">
          {imageUrls.map((url, index) => (
            <div key={url} className="relative">
              <Image src={url} width={300} height={300} alt={`img-${index}`} />
              <button
                onClick={() => handleDeleteImage(url)}
                className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {imageUrls.length > 0 && !isUploaded && (
        <CustomButton
          type="primary-btn"
          title={isPending ? "Uploading..." : "بارگذاری عکس"}
          disabled={isPending}
          onClick={handleClickUploadImagesButton}
        />
      )}
    </div>
  );
}
export default Uploader;
