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

function index() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [page, setPage] = useState(1);

  const [searchQuery, setSearchQuery] = useState("");
  const { data: orders, isLoading, error } = trpc.main.getAllOrders.useQuery();

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const updateOrderStatus = trpc.main.updateOrderStatus.useMutation({
    onSuccess: () => {
      toast.custom(
        <ToastContent type="success" message="Order created successfully!" />
      );
      router.reload();
    },
    onError: (err) => {
      {
        toast.custom(<ToastContent type="error" message={err?.message} />);
      }
    },
  });
  const { t } = useTranslation();

  const handleStatusChange = (id: number, newStatus: string) => {
    updateOrderStatus.mutate({ id, status: newStatus });
  };
  const { isAuthenticated, isMounted } = useAuthRedirect();

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }
  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className=" w-full">
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1 className=" mx-auto font-PeydaBlack text-center">
        {t("rent.orders")}
      </h1>
      <div className=" text-end">
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
          orders?.map((i) => (
            <div key={i.id}>
              <Box>
                <TicketOrder data={i} handleStatusChange={handleStatusChange} />
                <p className="font-PeydaBold text-sm">
                  Sending Type: {i.sendingType}
                </p>
              </Box>
            </div>
          ))}
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={handlePrevPage} disabled={page === 1}>
          <LuArrowBigLeftDash size={30} />{" "}
        </button>
        {/* <span className="mx-8">{`${page} / ${orders.totalPages}`}</span>
        <button onClick={handleNextPage} disabled={page === orders.totalPages}>
          <LuArrowBigRightDash size={30} />{" "}
        </button> */}
      </div>
    </div>
  );
}

export default index;
