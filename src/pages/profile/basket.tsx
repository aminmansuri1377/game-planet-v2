import React from "react";
import { useRouter } from "next/router";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import TicketBasket from "../../components/basket/TicketBasket";
import { trpc } from "../../../utils/trpc";
import { useSession } from "next-auth/react";
import Loading from "../../components/ui/Loading";
import { useTranslation } from "react-i18next";
import { FcBinoculars } from "react-icons/fc";
import jalaali from "jalaali-js";
import ToastContent from "../../components/ui/ToastContent";
import toast from "react-hot-toast";

function Basket() {
  const { t } = useTranslation();
  const { data: session } = useSession();
  const userId = session?.user?.id ? Number(session.user.id) : null; // Ensure userId is a number or null
  const {
    data: orders,
    isLoading,
    error,
  } = trpc.main.getOrders.useQuery(
    { userId: userId! }, // Use non-null assertion (!) since we check enabled
    { enabled: !!userId } // Only enable the query if userId is defined
  );
  const router = useRouter();

  const handleBack = () => {
    router.back();
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

  if (isLoading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mx-5">
        <div onClick={handleBack}>
          <FaArrowLeftLong />
        </div>
        <div className="flex rounded-full bg-gradient-to-tr shadow-xl shadow-purple-800 from-[#9E16BD] to-[#5F1470] p-3 items-center text-center mr-2">
          <FaShoppingBasket size={34} className="text-gray-300" />
        </div>
        <div></div>
      </div>
      <h1 className="font-PeydaBlack my-5">{t("rent.myCart")}</h1>
      {orders ? (
        orders.length > 0 ? (
          <div className="h-[55vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200">
            {orders
              .slice()
              .reverse()
              .map((order, index) => (
                <div key={index}>
                  <TicketBasket
                    data={order}
                    handleStatusChange={handleStatusChange}
                  />
                  <p className="font-PeydaBold text-sm">
                    Sending Type: {order.sendingType}
                    start date: {gregorianToPersian(new Date(order?.startDate))}
                    end date: {gregorianToPersian(new Date(order?.endDate))}
                    total Price : {order?.totalPrice}
                  </p>
                </div>
              ))}
          </div>
        ) : (
          <h1 className="text-center font-bold mx-auto items-center">
            <FcBinoculars size={50} />{" "}
          </h1>
        )
      ) : (
        "loading"
      )}
    </div>
  );
}

export default Basket;
