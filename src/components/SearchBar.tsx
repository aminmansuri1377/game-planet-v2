// components/SearchBar.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";

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
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearch();
          }
        }}
        className="border border-gray-300 rounded-lg py-2 px-4 w-full text-black"
      />
      {/* Show suggestions dropdown */}
      {searchQuery && suggestedProducts && suggestedProducts.length > 0 && (
        <div className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full z-10 text-amber-950">
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
