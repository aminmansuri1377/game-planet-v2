import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Box from "../../../components/Box";
import CustomButton from "../../../components/ui/CustomButton";
import Loading from "../../../components/ui/Loading";
import { useAuthRedirect } from "../../../components/hooks/useAuthRedirect"; // Named import
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiTwotoneDelete } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import ProductCard from "@/components/ui/ProductCard";
import SellerProductCard from "@/components/ui/SellerProductCard";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { AiFillProduct } from "react-icons/ai";
import { WithRole } from "@/components/auth/WithRole";
import { AiOutlineProduct } from "react-icons/ai";

const Products = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { data: session, status } = useSession(); // Get the authenticated user's session

  const {
    data: products,
    isLoading,
    error,
  } = trpc.main.getSellerProducts.useQuery(
    {
      sellerId: session?.user?.id as number, // Fetch products for the logged-in seller
    },
    {
      enabled: !!session?.user?.id, // Only run the query if sellerId is defined
    }
  );

  // Define deleteProductMutation
  const deleteProductMutation = trpc.main.deleteProduct.useMutation({
    onSuccess: () => {
      // Refresh the page or refetch products after deletion
      router.reload();
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
    },
  });

  const { isAuthenticated, isMounted } = useAuthRedirect(); // Use the hook

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  // if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!products) return <p>No products found.</p>;

  const handleUpdateProduct = (productId: number) => {
    router.push(`/seller/products/update?id=${productId}`);
  };

  const handleDeleteProduct = async (
    productId: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    await deleteProductMutation.mutateAsync({
      productId,
      sellerId: session?.user?.id as number, // Ensure only the seller can delete their own product
    });
  };

  return (
    <WithRole allowedRoles={["seller"]}>
      <div className=" min-h-screen">
        <HeadOfPages
          title="محصولات"
          back={
            <div onClick={handleBack} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <AiFillProduct size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />
        {isLoading ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mx-3">
            {products && products.length === 0 ? (
              <div className=" text-primary font-PeydaBold text-center min-h-screen mt-52">
                <AiOutlineProduct className=" mx-auto" size={80} />
                <h1>شما هنوز هیچ محصولی ندارید</h1>
              </div>
            ) : (
              <div>
                {products?.map((product) => (
                  <div key={product.id} className="">
                    <div onClick={() => handleUpdateProduct(product.id)}>
                      <SellerProductCard
                        imgUrl={product.images ? product.images[0] : ""}
                        imgAlt={product.name}
                        name={product.name}
                        price={`${product.price}`}
                        // handleSave={(e) => handleSave(product.id, e)}
                        // isSaved={isSaved}
                        rate={8}
                      />
                      <AiTwotoneDelete
                        size={30}
                        onClick={(e) => handleDeleteProduct(product.id, e)}
                        className=" mt-[-60px] ml-2"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </WithRole>
  );
};
//export const dynamic = "force-dynamic";

export default Products;
