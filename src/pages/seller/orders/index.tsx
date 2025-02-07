import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Box from "@/components/Box";
import TicketOrder from "@/components/TicketOrder";
import Loading from "@/components/ui/Loading";
import { useAuthRedirect } from "@/components/hooks/useAuthRedirect";
import ToastContent from "@/components/ui/ToastContent";
import { toast } from "react-hot-toast";
import { LuArrowBigRightDash } from "react-icons/lu";
import { LuArrowBigLeftDash } from "react-icons/lu";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

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

  const { isAuthenticated, isMounted } = useAuthRedirect();
  if (!isMounted) return null;
  if (!isAuthenticated) return null;
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full">
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1 className="mx-auto font-PeydaBlack text-center">
        {t("rent.orders")}
      </h1>
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
              <Box>
                <TicketOrder
                  data={order}
                  handleStatusChange={handleStatusChange}
                />
                <p className="font-PeydaBold text-sm">
                  Sending Type: {order.sendingType}
                </p>
              </Box>
            </div>
          ))}
      </div>
    </div>
  );
}

export default SellerOrderManagement;
