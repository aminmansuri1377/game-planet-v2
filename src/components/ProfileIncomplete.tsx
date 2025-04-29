// components/product/ProfileIncomplete.tsx
import { FaArrowLeftLong } from "react-icons/fa6";

interface ProfileIncompleteProps {
  onBack: () => void;
  onCompleteProfile: () => void;
}

export function ProfileIncomplete({
  onBack,
  onCompleteProfile,
}: ProfileIncompleteProps) {
  return (
    <div className="text-center my-10">
      <div onClick={onBack}>
        <FaArrowLeftLong />
      </div>
      <div className="mt-4 text-center font-PeydaBold min-h-screen">
        <p className="my-10">لطفا حساب کاربری خود را تکمیل کنید.</p>
        <button
          onClick={onCompleteProfile}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          تکمیل پروفایل
        </button>
      </div>
    </div>
  );
}
