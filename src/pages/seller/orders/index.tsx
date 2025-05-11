import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Loading from "../../../components/ui/Loading";
import { useAuthRedirect } from "../../../components/hooks/useAuthRedirect";
import ToastContent from "../../../components/ui/ToastContent";
import { toast } from "react-hot-toast";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import jalaali from "jalaali-js";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { LiaClipboardListSolid } from "react-icons/lia";
import { WithRole } from "@/components/auth/WithRole";
import { MdProductionQuantityLimits } from "react-icons/md";
import { debounce } from "../../../../utils/debounce";
import TicketOrder from "../../../components/TicketOrder";

function SellerOrderManagement() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [searchQuery, setSearchQuery] = useState("");

  const { data: session } = useSession();
  const sellerId = session?.user?.id ? Number(session.user.id) : null;

  // Main query that handles both cases (with and without search)
  const {
    data: orders,
    isLoading,
    error,
  } = trpc.main.getSellerOrders.useQuery(
    {
      sellerId: sellerId!,
      phone: searchQuery, // Pass search query to the backend
    },
    {
      enabled: !!sellerId,
      keepPreviousData: true, // Smooth transition between searches
    }
  );

  const updateOrderStatus = trpc.main.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent
          type="success"
          message="Order status updated successfully!"
        />
      );
      router.reload();
    },
    onError: (err) => {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    },
  });

  const handleStatusChange = async (id: number, newStatus: string) => {
    try {
      await updateOrderStatus.mutateAsync({ id, status: newStatus });
      await trpc.main.updateContractStep.mutate({
        orderId: id,
        newStatus,
      });
      toast.custom(
        <ToastContent
          type="success"
          message="Order status and contract updated successfully!"
        />
      );
      router.reload();
    } catch (err) {
      toast.custom(<ToastContent type="error" message={err?.message} />);
    }
  };

  const gregorianToPersian = (date: Date): string => {
    const gregorianDate = new Date(date);
    const { jy, jm, jd } = jalaali.toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1,
      gregorianDate.getDate()
    );
    return `${jy}/${jm}/${jd}`;
  };

  const { isAuthenticated, isMounted } = useAuthRedirect();
  if (!isMounted) return null;
  if (!isAuthenticated) return null;

  // Debounced search handler
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

  // Immediate handler for input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleSearch(e.target.value);
  };

  return (
    <WithRole allowedRoles={["seller"]}>
      <div className="w-full">
        <HeadOfPages
          title="سفارشات"
          back={
            <div onClick={handleBack} className="m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-14 text-center mx-auto">
              <RoundButton
                Children={
                  <div>
                    <LiaClipboardListSolid size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        <div className="text-end mx-5 mt-5">
          <input
            type="text"
            placeholder="جستجو با شماره تلفن مشتری..."
            onChange={handleInputChange}
            className="border p-2 rounded text-black my-2 font-PeydaRegular w-full"
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {error ? (
              <p className="text-red-500 text-center py-4">
                خطا: {error.message}
              </p>
            ) : (
              <div>
                {orders && orders.length === 0 ? (
                  <div className="text-primary text-center min-h-screen mt-52">
                    <MdProductionQuantityLimits className="mx-auto" size={80} />
                    <h1 className="font-PeydaBold">
                      {searchQuery
                        ? "هیچ سفارشی با این شماره تلفن یافت نشد"
                        : "شما هنوز هیچ سفارشی ندارید"}
                    </h1>
                  </div>
                ) : (
                  orders?.map((order) => (
                    <div key={order.id}>
                      <TicketOrder
                        data={order}
                        handleStatusChange={handleStatusChange}
                      />
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </WithRole>
  );
}
export const dynamic = "force-dynamic";

export default SellerOrderManagement;
