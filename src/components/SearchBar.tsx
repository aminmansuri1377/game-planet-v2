// components/SearchBar.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import CategoryCart from "./ui/CategoryCart";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // Fetch suggestions as the user types
  const { data: suggestedProducts } = trpc.main.getProductNames.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/search?query=${searchQuery}`);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    router.push(`/search?query=${suggestion}`);
  };

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="جستجوی محصول..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="rounded-full py-4 px-4 w-full text-white bg-gradient-to-r from-gra-100 to-gra-200 font-PeydaRegular"
      />
      <button
        onClick={handleSearch}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white"
      >
        <FiSearch size={20} />
      </button>
      {/* Show suggestions dropdown */}
      {searchQuery && suggestedProducts && suggestedProducts.length > 0 && (
        <div className="absolute bg-secondary border border-gray-300 rounded-lg mt-1 w-full z-10 text-white">
          {suggestedProducts.map((productName, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(productName)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {productName}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
