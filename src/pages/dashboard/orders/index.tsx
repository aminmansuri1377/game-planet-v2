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
import jalaali from "jalaali-js";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { LiaClipboardListSolid } from "react-icons/lia";
import { WithRole } from "@/components/auth/WithRole";
import { debounce } from "../../../../utils/debounce";
import { MdProductionQuantityLimits } from "react-icons/md";

function index() {
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
  } = trpc.main.getAllOrders.useQuery(
    {
      phone: searchQuery, // Pass search query to the backend
    },
    {
      keepPreviousData: true, // Smooth transition between searches
    }
  );
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);
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
  const gregorianToPersian = (date: Date): string => {
    const gregorianDate = new Date(date);
    const { jy, jm, jd } = jalaali.toJalaali(
      gregorianDate.getFullYear(),
      gregorianDate.getMonth() + 1, // Months are 0-based in JS
      gregorianDate.getDate()
    );
    return `${jy}/${jm}/${jd}`; // Format: YYYY/MM/DD
  };
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
    <WithRole allowedRoles={["manager"]}>
      <div className=" w-full">
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

        <div className=" text-end mt-12">
          <div className="mx-4 mt-4 mb-6">
            <input
              type="text"
              placeholder="جستجو با شماره تلفن مشتری..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg text-right text-black"
            />
          </div>
        </div>
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
    </WithRole>
  );
}
export const dynamic = "force-dynamic";
export default index;
