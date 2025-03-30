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
import Link from "next/link";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { MdOutlinePersonAdd } from "react-icons/md";
import { WithRole } from "@/components/auth/WithRole";

function index() {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const [page, setPage] = useState(1);
  const limit = 10;

  const { data: buyers } = trpc.main.getBuyers.useQuery();
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
  // if (isLoading) return <Loading />;
  // if (error) return <p>Error: {error.message}</p>;
  return (
    <WithRole allowedRoles={["manager"]}>
      <div className=" w-full min-h-screen">
        <HeadOfPages
          title="اجاره کنندگان"
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
                    <MdOutlinePersonAdd size={40} className="text-center" />
                  </div>
                }
              />
            </div>
          }
        />

        <div className=" mt-12 mx-2 bg-cardbg p-1 rounded-lg">
          <table>
            <thead>
              <tr>
                <th>تلفن</th>
                <th>نام</th>
                <th></th>
                <th>کدملی</th>
              </tr>
            </thead>
            <tbody>
              {buyers &&
                buyers?.map((buyer) => (
                  <tr key={buyer.id}>
                    <td>
                      <Link href={`/dashboard/singleBuyer/${buyer.id}`}>
                        {buyer.phone}
                      </Link>
                    </td>
                    <td>{buyer.firstName}</td>
                    <td>{buyer.lastName}</td>
                    <td>{buyer.IDnumber}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </WithRole>
  );
}

export default index;
