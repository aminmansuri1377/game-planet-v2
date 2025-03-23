// pages/index.tsx
import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Loading from "../components/ui/Loading";
import CustomButton from "../components/ui/CustomButton";
import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import HeaderImage from "../../public/images/header.png";
import Image from "next/image";
import Header from "@/components/Header";
import { ImVideoCamera } from "react-icons/im";
import CategoryCart from "@/components/ui/CategoryCart";
import { GiConsoleController } from "react-icons/gi";
import WhyCard from "@/components/ui/WhyCard";
import { AiOutlineSafety } from "react-icons/ai";
import { TbPigMoney } from "react-icons/tb";
import { LuLeaf } from "react-icons/lu";
import { LuAlarmClock } from "react-icons/lu";

const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = trpc.main.getCategories.useQuery();

  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories/${categoryId}`);
  };

  const sellerSignUp = () => {
    router.push("/seller/signUp");
  };
  const sellerSignIn = () => {
    router.push("/seller/signIn");
  };
  const buyerSignUp = () => {
    router.push("/signUp");
  };
  const buyerSignIn = () => {
    router.push("/signIn");
  };
  if (isCategoriesLoading) return <Loading />;
  if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  return (
    <div className="text-center min-h-screen px-3">
      <Header />
      <div className="px-5 mt-10">
        <Image src={HeaderImage} alt="header" />
        <h1 className="font-PeydaBlack text-center mt-5 text-3xl">
          !به رنتا خوش آمدید
        </h1>
        <h1 className="font-PeydaBold text-center mb-5 mt-3">
          اجاره هر چیزی که نیاز دارید با یک کلیک
        </h1>

        <CustomButton
          type="secondary-btn"
          title="ورودخ"
          onClick={() => buyerSignIn()}
        />
        <CustomButton
          type="primary-btn"
          title="ثبت نامخ"
          onClick={() => buyerSignUp()}
        />

        <CustomButton
          type="secondary-btn"
          title="ورودف"
          onClick={() => sellerSignIn()}
        />
        <CustomButton
          type="primary-btn"
          title="ثبت نامف"
          onClick={() => sellerSignUp()}
        />
        {/* Search Input */}
        <h1 className="font-PeydaBlack text-center mt-10 text-3xl">
          دنبال چه چیزی میگردی ؟
        </h1>
        <div className="my-4">
          <SearchBar />
        </div>

        {/* Categories */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} />
          <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} />
          <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} />
          {categories
            ? categories.map((category) => (
                <div
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <CategoryCart
                    text={category.name}
                    Icon={GiConsoleController}
                  />
                </div>
              ))
            : ""}
        </div>
        <h1 className="font-PeydaBlack text-center mt-10 text-2xl">
          چرا از رنتا استفاده کنم ؟{" "}
        </h1>
        <div className=" grid grid-cols-2 gap-8 mx-2 my-10">
          <WhyCard
            title="امنیت"
            text="لورم ایپسوم متن ساختگی با تولید سادگی "
            Icon={AiOutlineSafety}
          />
          <WhyCard
            title="به صرفه تر"
            text="لورم ایپسوم متن ساختگی با تولید سادگی "
            Icon={TbPigMoney}
          />
          <WhyCard
            title="محافظت"
            text="لورم ایپسوم متن ساختگی با تولید سادگی "
            Icon={LuLeaf}
          />
          <WhyCard
            title="سریع تر"
            text="لورم ایپسوم متن ساختگی با تولید سادگی "
            Icon={LuAlarmClock}
          />
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
