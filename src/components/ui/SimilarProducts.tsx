import React from "react";
import ProductCard from "./ProductCard";
import { Product } from "@prisma/client";
import ProductImg from "../../../public/images/p2.webp";
import SimilarProductCard from "./SimilarProductCard";

interface SimilarProductsProps {
  products: Product[];
  onProductClick: (id: number) => void;
  onSave: (id: number, e: React.MouseEvent) => void;
}

function SimilarProducts({
  products,
  onProductClick,
  onSave,
}: SimilarProductsProps) {
  return (
    <div className="my-8 mx-5 ">
      <h2 className="text-xl font-bold mb-4 font-PeydaBold text-right">
        محصولات مشابه
      </h2>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            onClick={() => onProductClick(product.id)}
            className="cursor-pointer"
          >
            <SimilarProductCard
              imgUrl={product?.images ? product?.images[0] : ProductImg}
              imgAlt={product.name}
              name={product.name}
              price={product.price}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SimilarProducts;
