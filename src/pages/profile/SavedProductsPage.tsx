import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import React from "react";
import { useSession } from "next-auth/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import ProductCard from "@/components/ui/ProductCard";
import ProductImg from "../../../public/images/p2.webp";
import toast from "react-hot-toast";

const SavedProductsPage = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const buyerId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const { data: savedProducts } = trpc.main.getSavedProducts.useQuery(
    {
      buyerId,
    },
    {
      enabled: !!buyerId, // Only fetch if buyerId is available
    }
  );
  const saveProductMutation = trpc.main.saveProduct.useMutation({
    onSuccess: () => {
      toast.success("Product saved successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unsaveProductMutation = trpc.main.unsaveProduct.useMutation({
    onSuccess: () => {
      toast.success("Product unsaved successfully!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleSave = (productId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event from bubbling up to the parent div

    if (!buyerId) return;

    const isSaved = savedProducts?.some((sp) => sp.productId === productId);

    if (isSaved) {
      unsaveProductMutation.mutate({ buyerId, productId });
    } else {
      saveProductMutation.mutate({ buyerId, productId });
    }
  };

  return (
    <div className="p-6">
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <h1 className="text-2xl font-bold mb-6">Saved Products</h1>
      <div className="space-y-4">
        {savedProducts?.map(({ product }) => {
          const isSaved = savedProducts?.some(
            (sp) => sp.productId === product.id
          );
          return (
            <div
              key={product.id}
              onClick={() => router.push(`/singleProduct/${product.id}`)}
            >
              <ProductCard
                imgUrl={ProductImg}
                imgAlt={product.name}
                name={product.name}
                info={`Price: $${product.price} , ${product.description}`}
                handleSave={(e) => handleSave(product.id, e)} // Pass the event
                isSaved={isSaved}
                rate={8}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SavedProductsPage;
