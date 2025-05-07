import React, { useState } from "react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import TicketBasket from "../../components/basket/TicketBasket";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Loading from "../../components/ui/Loading";
import { useTranslation } from "react-i18next";
import { FcBinoculars } from "react-icons/fc";
import ToastContent from "../../components/ui/ToastContent";
import toast from "react-hot-toast";
import RoundButton from "@/components/ui/RoundButton";
import HeadOfPages from "@/components/ui/HeadOfPages";
import { WithRole } from "@/components/auth/WithRole";
import { debounce } from "../../../utils/debounce";

function Basket() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : null;
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: orders,
    isLoading,
    error,
  } = trpc.main.getOrders.useQuery(
    {
      userId: userId!,
      productName: searchQuery, // Pass search query to backend
    },
    {
      enabled: !!userId,
      keepPreviousData: true, // Smooth transitions during search
    }
  );

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  // Debounced search handler
  const handleSearch = debounce((query: string) => {
    setSearchQuery(query);
  }, 300);

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

  if (error) return <p>Error: {error.message}</p>;
  if (!session) {
    return (
      <div className="min-h-screen font-PeydaBold my-20">
        <div onClick={handleBack} className="m-5">
          <FaArrowLeftLong />
        </div>
        <div>لطفا وارد شوید</div>
      </div>
    );
  }

  return (
    <WithRole allowedRoles={["buyer"]}>
      <div className="w-full min-h-screen">
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
                    <FaShoppingBasket size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        {/* Search Input */}
        <div className="mx-4 mt-4 mb-6">
          <input
            type="text"
            placeholder="جستجو با نام محصول..."
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg text-right text-black"
          />
        </div>

        {isLoading ? (
          <Loading />
        ) : (
          <div>
            {orders ? (
              orders.length > 0 ? (
                <div className="overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
                  {orders.map((order, index) => (
                    <div key={index}>
                      <TicketBasket
                        data={order}
                        handleStatusChange={handleStatusChange}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center font-PeydaBold text-primary mx-auto items-center min-h-screen mt-52">
                  <FcBinoculars className="mx-auto" size={50} />
                  <h1>
                    {searchQuery
                      ? "هیچ سفارشی با این نام محصول یافت نشد"
                      : "شما هنوز محصولی را سفارش ندادید"}
                  </h1>
                </div>
              )
            ) : null}
          </div>
        )}
      </div>
    </WithRole>
  );
}

export default Basket;
