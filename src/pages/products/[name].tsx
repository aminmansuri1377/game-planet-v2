import { useState } from "react";
import { useRouter } from "next/router";
import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import { FaArrowLeftLong } from "react-icons/fa6";
import React from "react";

const ProductPage = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { name } = router.query; // Get the product name from the URL
  const [sortByPrice, setSortByPrice] = useState(false); // State for sorting

  // Fetch products by name
  const {
    data: products,
    isLoading,
    error,
  } = trpc.main.getProducts.useQuery({
    name: name as string,
    sortByPrice, // Pass the sorting option to the API
  });

  // Handle sorting toggle
  const handleSortChange = () => {
    setSortByPrice((prev) => !prev); // Toggle sorting
  };

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="p-6">
      <div className="mb-10" onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1 className="text-2xl font-bold mb-6">All {name} Products</h1>

      {/* Sorting Radio Button */}
      <div className="mb-6">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={sortByPrice}
            onChange={handleSortChange}
            className="form-radio"
          />
          <span>Sort by Price (Low to High)</span>
        </label>
      </div>

      {/* Display Products */}
      <div className="space-y-4">
        {products && products.length > 0 ? (
          products.map((product) => (
            <div
              key={product.id}
              onClick={() => router.push(`/singleProduct/${product.id}`)}
            >
              <DeviceCard
                product={product.name}
                info={`Price: $${product.price}`} // Display price
              />
            </div>
          ))
        ) : (
          <p className="text-gray-500">No products found for {name}.</p>
        )}
      </div>
    </div>
  );
};
//export const dynamic = "force-dynamic";

export default ProductPage;
