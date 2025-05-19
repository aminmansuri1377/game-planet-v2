// pages/manager/[userId].tsx
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { FaArrowLeftLong } from "react-icons/fa6";
import Loading from "@/components/ui/Loading";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { MdOutlinePersonRemoveAlt1 } from "react-icons/md";
import Image from "next/image";
import { WithRole } from "@/components/auth/WithRole";

const UserDetailsPage = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  // Extract userId and userType from the query
  const { userId } = router.query;

  const { data: seller } = trpc.main.getSellerById.useQuery({
    userId: Number(userId),
  });
  const utils = trpc.useUtils();
  const confirmSeller = trpc.main.confirmSeller.useMutation({
    onSuccess: () => {
      utils.main.getSellerById.invalidate({ userId: Number(userId) });
    },
  });
  const unconfirmSeller = trpc.main.unconfirmSeller.useMutation({
    onSuccess: () => {
      utils.main.getSellerById.invalidate({ userId: Number(userId) });
    },
  });

  const handleConfirm = () => {
    confirmSeller.mutate({ userId: Number(userId) });
  };

  const handleUnconfirm = () => {
    unconfirmSeller.mutate({ userId: Number(userId) });
  };
  if (!seller) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <WithRole allowedRoles={["manager"]}>
      <div className=" w-full min-h-screen">
        <HeadOfPages
          title="اجاره دهنده"
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
                    <MdOutlinePersonRemoveAlt1
                      size={40}
                      className="text-center"
                    />
                  </div>
                }
              />
            </div>
          }
        />
        {seller && (
          <div className=" m-5">
            <h2>
              Seller: {seller.firstName} {seller.lastName}
            </h2>
            <p>Phone: {seller.phone}</p>
            <p>ID Number: {seller.IDnumber}</p>
            {seller?.idCardImage && (
              <Image
                src={seller?.idCardImage}
                alt={seller?.lastName}
                width={200}
                height={200}
              />
            )}
            <div className="mt-4">
              <p>Status: {seller.confirmed ? "Confirmed" : "Not Confirmed"}</p>
              {seller.confirmed ? (
                <button
                  onClick={handleUnconfirm}
                  className="bg-red-500 text-white px-4 py-2 rounded"
                >
                  Unconfirm
                </button>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="bg-green-500 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              )}
            </div>
            {/* Add seller products and orders here */}
          </div>
        )}
      </div>
    </WithRole>
  );
};
//export const dynamic = "force-dynamic";

export default UserDetailsPage;
