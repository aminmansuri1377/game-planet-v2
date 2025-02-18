// pages/categories/[id].tsx
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import React from "react";
import { FaArrowLeftLong } from "react-icons/fa6";

const CategoryProductsPage = () => {
  const router = useRouter();
  const { id } = router.query;

  const {
    data: products,
    isLoading,
    error,
  } = trpc.main.getProductsByCategory.useQuery({
    categoryId: Number(id),
  });

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <h1 className="text-2xl font-bold mb-6">Products in Category</h1>
      <div className="space-y-4">
        {products?.map((product) => (
          <div
            key={product.id}
            onClick={() => router.push(`/singleProduct/${product.id}`)}
          >
            <DeviceCard
              product={product.name}
              info={`Price: $${product.price}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryProductsPage;
