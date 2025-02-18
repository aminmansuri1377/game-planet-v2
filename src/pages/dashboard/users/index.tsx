import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import Box from "../../../components/Box";
import Loading from "../../../components/ui/Loading";
import { useAuthRedirect } from "../../../components/hooks/useAuthRedirect";
import ToastContent from "../../../components/ui/ToastContent";
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
  const limit = 10;

  const {
    data: users,
    isLoading,
    error,
  } = trpc.main.getUsers.useQuery({ page, limit });
  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));

  const { t } = useTranslation();

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
      {/* <h1 className=" mx-auto font-PeydaBlack text-center">
        {t("rent.orders")}
      </h1> */}
      <div>
        {users &&
          users?.orders.map((i) => (
            <div key={i.id}>
              <Box lessPaddingY>
                <div>{i.username}</div>
                <div>{i.email}</div>
              </Box>
            </div>
          ))}
      </div>
      <div className="flex justify-center mt-4">
        <button onClick={handlePrevPage} disabled={page === 1}>
          <LuArrowBigLeftDash size={30} />{" "}
        </button>
        <span className="mx-8">{`${page} / ${users.totalPages}`}</span>
        <button onClick={handleNextPage} disabled={page === users.totalPages}>
          <LuArrowBigRightDash size={30} />{" "}
        </button>
      </div>
    </div>
  );
}

export default index;
