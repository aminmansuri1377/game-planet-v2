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
import { useSession } from "next-auth/react";
import { WithRole } from "@/components/auth/WithRole";
import Divider from "@/components/ui/Divider";
import dynamic from "next/dynamic";
// const Loading = dynamic(() => import("@/components/ui/Loading"), {
//   ssr: false,
// });
const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: categories,
    isLoading: isCategoriesLoading,
    error: categoriesError,
  } = trpc.main.getCategories.useQuery();
  const { data: session, status } = useSession();
  const [showForSeller, setShowForSeller] = useState(false);
  const [showForBuyer, setShowForBuyer] = useState(false);
  const showForBuyerHandler = () => {
    setShowForBuyer(true);
    setShowForSeller(false);
  };
  const showForSellerHandler = () => {
    setShowForBuyer(false);
    setShowForSeller(true);
  };
  console.log("first", session);
  const handleCategoryClick = (categoryId: number) => {
    router.push(`/categories?id=${categoryId}`);
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
  // if (isCategoriesLoading) return <Loading />;
  // if (categoriesError) return <p>Error: {categoriesError.message}</p>;

  return (
    <div className="text-center min-h-screen px-3">
      <Header />

      <div className="px-5 mt-10">
        <div className=" md:flex">
          <Image src={HeaderImage} alt="header" />
          <div>
            <h1 className="font-PeydaBlack text-center mt-5 text-3xl">
              !به رنتا خوش آمدید
            </h1>
            <h1 className="font-PeydaBold text-center mb-5 mt-3">
              اجاره هر چیزی که نیاز دارید با یک کلیک
            </h1>
            {!session && (
              <div>
                <CustomButton
                  type={showForSeller ? `secondary-btn` : `primary-btn`}
                  title="اجاره گیرنده هستم"
                  onClick={() => showForBuyerHandler()}
                />
                {showForBuyer && (
                  <div>
                    <CustomButton
                      type="secondary-btn"
                      title="ورود"
                      onClick={() => buyerSignIn()}
                    />
                    <CustomButton
                      type="primary-btn"
                      title="ثبت نام"
                      onClick={() => buyerSignUp()}
                    />
                  </div>
                )}
                {/* <div className=" mt-5">
                  <Divider />
                </div> */}
                <CustomButton
                  type={showForBuyer ? `secondary-btn` : `primary-btn`}
                  title="اجاره دهنده هستم"
                  onClick={() => showForSellerHandler()}
                  className=" mt-5"
                />
                {showForSeller && (
                  <div>
                    <CustomButton
                      type="secondary-btn"
                      title="ورود"
                      onClick={() => sellerSignIn()}
                    />
                    <CustomButton
                      type="primary-btn"
                      title="ثبت نام"
                      onClick={() => sellerSignUp()}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* Search Input */}
        <h1 className="font-PeydaBlack text-center mt-10 text-3xl">
          دنبال چه چیزی میگردی ؟
        </h1>
        <div className="my-4">
          <SearchBar />
        </div>

        {/* Categories */}
        {categoriesError ? (
          <p className=" mx-auto">Error: {categoriesError?.message}</p>
        ) : (
          <div>
            {isCategoriesLoading ? (
              <Loading />
            ) : (
              <div className="grid grid-cols-3 md:grid-cols-5 gap-2 mb-8">
                {/* <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} />
                <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} />
                <CategoryCart text="فیلم برداری" Icon={ImVideoCamera} /> */}
                {categories
                  ? categories.map((category) => (
                      <div
                        key={category.id}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <CategoryCart
                          text={category.name}
                          Icon={category.icon ? category.icon : undefined}
                        />
                      </div>
                    ))
                  : ""}
              </div>
            )}
          </div>
        )}
        <h1 className="font-PeydaBlack text-center mt-10 text-2xl">
          چرا از رنتا استفاده کنم ؟{" "}
        </h1>
        <div className=" grid grid-cols-2 md:grid-cols-4 gap-8 mx-2 my-10">
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
//export const dynamic = "force-dynamic";

export default WelcomePage;
