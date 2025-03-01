import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import React from "react";
import { useSession } from "next-auth/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";

const SavedProductsPage = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const buyerId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const { data: savedProducts, isLoading } =
    trpc.main.getSavedProducts.useQuery({
      buyerId,
    });

  if (isLoading) return <Loading />;

  return (
    <div className="p-6">
      <div onClick={() => router.back()}>
        <FaArrowLeftLong />
      </div>
      <h1 className="text-2xl font-bold mb-6">Saved Products</h1>
      <div className="space-y-4">
        {savedProducts?.map(({ product }) => (
          <div key={product.id}>
            <DeviceCard
              product={product}
              info={`Price: $${product.price}`}
              buyerId={buyerId}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedProductsPage;
