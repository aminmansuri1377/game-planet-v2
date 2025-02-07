import { useTranslation } from "react-i18next";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import Loading from "@/components/ui/Loading";
import ast from "../../public/models/33.png";
import bubu from "../../public/models/bubu.gif";
import Image from "next/image";
import DeviceCard from "@/components/ui/DeviceCard";
import CustomButton from "@/components/ui/CustomButton";

const WelcomePage = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const {
    data: products,
    isLoading,
    error,
  } = trpc.main.getProducts.useQuery({});
  // Group products by their names
  const groupedProducts = products?.reduce((acc, product) => {
    if (!acc[product.name]) {
      acc[product.name] = [];
    }
    acc[product.name].push(product);
    return acc;
  }, {} as Record<string, typeof products>);

  const handleProductClick = (productName: string) => {
    router.push(`/products/${productName}`); // Redirect to the product-specific page
  };

  const isSellerHandler = () => {
    router.push("/seller/signIn");
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="text-center">
      <h1 className="font-PeydaBlack text-center [word-spacing:5px] my-5">
        {t("rent.ps5AndXboxRental")}
      </h1>
      {/* <Image src={ast} alt="genc" className="my-10 scale-110" loading="lazy" /> */}
      <Image src={bubu} alt="b" loading="lazy" />

      <CustomButton
        type="primary-btn"
        title="اجاره دهنده هستم"
        onClick={() => isSellerHandler()}
      />
      <div>
        {groupedProducts && Object.keys(groupedProducts).length > 0 ? (
          Object.keys(groupedProducts).map((productName) => (
            <div
              key={productName}
              onClick={() => handleProductClick(productName)}
            >
              <DeviceCard
                product={productName}
                info={`${groupedProducts[productName].length} products available`}
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products available.</p>
        )}
      </div>
    </div>
  );
};

export default WelcomePage;
