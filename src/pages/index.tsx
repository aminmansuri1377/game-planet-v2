// pages/index.tsx
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Loading from "../components/ui/Loading";
import CustomButton from "../components/ui/CustomButton";
import { useState } from "react";
import SearchBar from "@/components/SearchBar";

const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = trpc.main.getCategories.useQuery();

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  const handleSearch = () => {
    router.push(`/search?query=${searchQuery}`);
  };
  // const handleSearch = () => {
  //   router.push(`/search/${searchQuery}`);
  // };
  const isSellerHandler = () => {
    router.push("/seller/signIn");
  };
  if (isCategoriesLoading) return <Loading />;
  if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  return (
    <div className="text-center">
      <h1 className="font-PeydaBlack text-center [word-spacing:5px] my-5">
        {t("rent.ps5AndXboxRental")}
      </h1>
      <CustomButton
        type="primary-btn"
        title="اجاره دهنده هستم"
        onClick={() => isSellerHandler()}
      />
      {/* Search Input */}
      <div className="mb-6">
        <SearchBar />
      </div>

      {/* Categories */}
      <div>
        {categories
          ? categories.map((category) => (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
              >
                <CustomButton title={category.name} type="secondary-btn" />
              </div>
            ))
          : ""}
      </div>
    </div>
  );
};

export default WelcomePage;
