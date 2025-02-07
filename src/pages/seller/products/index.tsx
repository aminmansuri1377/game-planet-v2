import { useRouter } from "next/router";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Box from "@/components/Box";
import CustomButton from "@/components/ui/CustomButton";
import Loading from "@/components/ui/Loading";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect"; // Named import
import { FaArrowLeftLong } from "react-icons/fa6";
import { AiTwotoneDelete } from "react-icons/ai";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const Products = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { data: session, status } = useSession(); // Get the authenticated user's session

  // Debug session data
  useEffect(() => {
    console.log("Session Status:", status);
    console.log("Session Data:", session);
  }, [session, status]);

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

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  if (!products) return <p>No products found.</p>;

  const handleUpdateProduct = (productId: number) => {
    router.push(`/seller/products/update/${productId}`);
  };

  const handleDeleteProduct = async (productId: number) => {
    await deleteProductMutation.mutateAsync({
      productId,
      sellerId: session?.user?.id as number, // Ensure only the seller can delete their own product
    });
  };

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <div>
        {products?.map((product) => (
          <div key={product.id} className="flex text-center items-center">
            <div onClick={() => handleUpdateProduct(product.id)}>
              <Box>
                <h1 className="font-PeydaBold text-center text-lg">
                  {product.name}
                </h1>
                <p>{product.description}</p>
                <p>Price: ${product.price}</p>
                <p>Inventory: {product.inventory}</p>
                <p>Sending Type: {product.sendingType.join(", ")}</p>
              </Box>
            </div>
            <AiTwotoneDelete
              size={30}
              onClick={() => handleDeleteProduct(product.id)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
