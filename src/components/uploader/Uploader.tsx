"use client";

import { ChangeEvent, useRef, useState, useTransition } from "react";
import { convertBlobUrlToFile } from "@/lib/utils";
import Image from "next/image";
import { uploadImage } from "../../../supabase/storage/client";

function Uploader({
  onUpload,
  singleUpload = false,
  bucket,
}: {
  onUpload: (urls: string[]) => void;
  singleUpload?: boolean;
  bucket?: string;
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
    });
  };

  // Function to handle deleting an image
  const handleDeleteImage = (urlToDelete: string) => {
    setImageUrls(imageUrls.filter((url) => url !== urlToDelete));
  };
  console.log("imageUrls", imageUrls);
  return (
    <div className="bg-slate-500 flex justify-center items-center flex-col gap-8">
      <input
        type="file"
        hidden
        multiple={!singleUpload}
        ref={imageInputRef}
        onChange={handleImageChange}
        disabled={isPending}
      />

      <button
        className="bg-slate-600 py-2 w-40 rounded-lg"
        onClick={() => imageInputRef.current?.click()}
        disabled={isPending}
      >
        Select Images
      </button>

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

      <button
        onClick={handleClickUploadImagesButton}
        className="bg-slate-600 py-2 w-40 rounded-lg"
        disabled={isPending}
      >
        {isPending ? "Uploading..." : "Upload Images"}
      </button>
    </div>
  );
}

export default Uploader;
