import { useRouter } from "next/router";

const BackButton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };
  return (
    <div className="absolute top-4 right-4">
      <button
        onClick={handleBack}
        className="flex items-center space-x-2 bg-gradient-to-r from-green-400 to-blue-500 text-white py-3 px-6 rounded-full shadow-lg transform transition-transform hover:scale-105 hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-700 z-40"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>
        <span className="font-semibold">Back</span>
      </button>
    </div>
  );
};

export default BackButton;
