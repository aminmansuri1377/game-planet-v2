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
import { WithRole } from "@/components/auth/WithRole";

function AllProducts() {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: orders,
    isLoading,
    error,
  } = trpc.main.getAllOrders.useQuery({
    page,
    limit: 10,
    searchQuery,
  });

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

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
    <WithRole allowedRoles={["manager"]}>
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
                </Box>
              </div>
            ))}
        </div>
        <div className="flex justify-center mt-4">
          <button onClick={handlePrevPage} disabled={page === 1}>
            <LuArrowBigLeftDash size={30} />{" "}
          </button>
          <span className="mx-8">{`${page} / ${Math.ceil(
            orders.length / 10
          )}`}</span>
          <button
            onClick={handleNextPage}
            disabled={page === Math.ceil(orders.length / 10)}
          >
            <LuArrowBigRightDash size={30} />{" "}
          </button>
        </div>
      </div>
    </WithRole>
  );
}
//export const dynamic = "force-dynamic";

export default AllProducts;
