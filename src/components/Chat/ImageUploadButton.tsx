// components/Chat/ImageUploadButton.tsx
import { FaImage } from "react-icons/fa";
import { useState } from "react";

interface ImageUploadButtonProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export const ImageUploadButton = ({
  onFileSelect,
  disabled = false,
}: ImageUploadButtonProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        disabled={disabled}
        className={`p-2 rounded-full ${
          isHovered && !disabled ? "bg-gray-200" : ""
        }`}
      >
        <label htmlFor="file-upload" className="cursor-pointer">
          <FaImage
            className={`text-gray-500 ${disabled ? "opacity-50" : ""}`}
          />
        </label>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
          disabled={disabled}
        />
      </button>
    </div>
  );
};
