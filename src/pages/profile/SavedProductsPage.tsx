import { trpc } from "../../../utils/trpc";
import Loading from "../../components/ui/Loading";
import DeviceCard from "../../components/ui/DeviceCard";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import ProductCard from "@/components/ui/ProductCard";
import ProductImg from "../../../public/images/p2.webp";
import toast from "react-hot-toast";
import HeadOfPages from "@/components/ui/HeadOfPages";
import { FaBookmark, FaRegBookmark } from "react-icons/fa";
import RoundButton from "@/components/ui/RoundButton";
import { WithRole } from "@/components/auth/WithRole";
import { PiBookmarksSimpleThin } from "react-icons/pi";

const SavedProductsPage = () => {
  const router = useRouter();
  const utils = trpc.useUtils();

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
      toast.success("محصول ذخیره شد!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });

  const unsaveProductMutation = trpc.main.unsaveProduct.useMutation({
    onSuccess: () => {
      toast.success("محصول از ذخیره ها حذف شد!");
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
  const handleSave = async (productId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!buyerId) return;

    const isSaved = savedProducts?.some((sp) => sp.productId === productId);

    // Optimistic update
    utils.main.getSavedProducts.setData({ buyerId }, (old) => {
      if (!old) return old;
      return isSaved
        ? old.filter((sp) => sp.productId !== productId)
        : [
            ...old,
            {
              buyerId,
              productId,
              product: savedProducts?.find((p) => p.id === productId),
            },
          ];
    });

    try {
      if (isSaved) {
        await unsaveProductMutation.mutateAsync({ buyerId, productId });
      } else {
        await saveProductMutation.mutateAsync({ buyerId, productId });
      }
    } catch (err) {
      // Revert if error
      utils.main.getSavedProducts.invalidate({ buyerId });
      console.error(err);
    }
  };

  return (
    <WithRole allowedRoles={["buyer"]}>
      <div className=" min-h-screen">
        <HeadOfPages
          title="ذخیره ها "
          back={
            <div onClick={() => router.back()} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <FaRegBookmark size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        <div className="space-y-4 p-6">
          {savedProducts && savedProducts.length === 0 ? (
            <div className=" text-primary font-PeydaBold text-center  min-h-screen mt-52">
              <PiBookmarksSimpleThin className=" mx-auto" size={80} />
              <h1>شما هنوز پستی را ذخیره نکردید</h1>
            </div>
          ) : (
            <div>
              {savedProducts?.map(({ product }) => {
                const isSaved = savedProducts?.some(
                  (sp) => sp.productId === product.id
                );
                return (
                  <div
                    key={product.id}
                    onClick={() =>
                      router.push(`/singleProduct?id=${product.id}`)
                    }
                    className=" grid grid-cols-2 gap-2"
                  >
                    <ProductCard
                      imgUrl={product?.images ? product?.images[0] : ProductImg}
                      imgAlt={product.name}
                      name={product.name}
                      price={`شبی $${product.price} تومان`}
                      handleSave={(e) => handleSave(product.id, e)} // Pass the event
                      isSaved={isSaved}
                      rate={8}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </WithRole>
  );
};
//export const dynamic = "force-dynamic";

export default SavedProductsPage;
