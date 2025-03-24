import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Box from "../../../components/Box";
import TicketOrder from "../../../components/TicketOrder";
import Loading from "../../../components/ui/Loading";
import { useAuthRedirect } from "../../../components/hooks/useAuthRedirect";
import ToastContent from "../../../components/ui/ToastContent";
import { toast } from "react-hot-toast";
import { LuArrowBigRightDash } from "react-icons/lu";
import { LuArrowBigLeftDash } from "react-icons/lu";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import jalaali from "jalaali-js";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { LiaClipboardListSolid } from "react-icons/lia";
import TicketBasket from "@/components/basket/TicketBasket";

function SellerOrderManagement() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { data: session } = useSession();
  const sellerId = session?.user?.id ? Number(session.user.id) : null; // Ensure sellerId is a number or null

  const {
    data: orders,
    isLoading,
    error,
  } = trpc.main.getSellerOrders.useQuery(
    { sellerId: sellerId! }, // Use non-null assertion (!) since we check enabled
    { enabled: !!sellerId } // Only enable the query if sellerId is defined
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

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

  const handleStatusChange = (id: number, newStatus: string) => {
    updateOrderStatus.mutate({ id, status: newStatus });
  };
  const gregorianToPersian = (date: Date): string => {
    const gregorianDate = new Date(date);
    const { jy, jm, jd } = jalaali.toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1, // Months are 0-based in JS
      gregorianDate.getDate()
    );
    return `${jy}/${jm}/${jd}`; // Format: YYYY/MM/DD
  };
  const { isAuthenticated, isMounted } = useAuthRedirect();
  if (!isMounted) return null;
  if (!isAuthenticated) return null;
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full">
      <HeadOfPages
        title="سفارشات"
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
                  <LiaClipboardListSolid size={40} className="text-center" />
                </div>
              }
            />
          </div>
        }
      />

      <div className="text-end">
        <input
          type="text"
          placeholder="Search user..."
          value={searchQuery}
          onChange={handleSearch}
          className="border p-2 rounded text-black my-2"
        />
      </div>
      <div>
        {orders &&
          orders.map((order) => (
            <div key={order.id}>
              <TicketOrder
                data={order}
                handleStatusChange={handleStatusChange}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default SellerOrderManagement;
