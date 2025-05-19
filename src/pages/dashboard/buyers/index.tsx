import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../../utils/trpc";
import { useAuthRedirect } from "../../../components/hooks/useAuthRedirect";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useRouter } from "next/router";
import Link from "next/link";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { MdOutlinePersonAdd } from "react-icons/md";
import { WithRole } from "@/components/auth/WithRole";
import { debounce } from "../../../../utils/debounce";

function BuyersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isMounted } = useAuthRedirect();
  const [searchTerm, setSearchTerm] = useState("");
  const [displayBuyers, setDisplayBuyers] = useState<any[]>([]);

  // Fetch all buyers
  const { data: allBuyers, isLoading: isLoadingAll } =
    trpc.main.getBuyers.useQuery();

  // Fetch searched buyers
  const { data: searchedBuyers, isLoading: isLoadingSearch } =
    trpc.main.getBuyersByPhone.useQuery(
      { phone: searchTerm },
      {
        enabled: searchTerm.length > 0,
      }
    );

  // Update displayBuyers based on search state
  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplayBuyers(searchedBuyers || []);
    } else {
      setDisplayBuyers(allBuyers || []);
    }
  }, [searchTerm, allBuyers, searchedBuyers]);

  const handleSearch = debounce((term: string) => {
    setSearchTerm(term);
  }, 300);

  const handleBack = () => {
    router.back();
  };

  if (!isMounted) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <WithRole allowedRoles={["manager"]}>
      <div className="w-full min-h-screen">
        <HeadOfPages
          title="اجاره کنندگان"
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
                    <MdOutlinePersonAdd size={40} className="text-center" />
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
            placeholder="جستجو با شماره تلفن..."
            className="w-full p-2 border border-gray-300 rounded-lg text-right text-black"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="mt-4 mx-2 bg-cardbg p-1 rounded-lg">
          {isLoadingAll || (searchTerm && isLoadingSearch) ? (
            <div className="text-center py-4">در حال بارگذاری...</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-2 text-right">تلفن</th>
                  <th className="p-2 text-right">نام</th>
                  <th className="p-2 text-right">نام خانوادگی</th>
                  <th className="p-2 text-right">تایید شده</th>
                </tr>
              </thead>
              <tbody>
                {displayBuyers.length ? (
                  displayBuyers.map((buyer) => (
                    <tr key={buyer.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-right">
                        <Link
                          href={`/dashboard/singleBuyer?userId=${buyer.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {buyer.phone}
                        </Link>
                      </td>
                      <td className="p-2 text-right">
                        {buyer.firstName || "-"}
                      </td>
                      <td className="p-2 text-right">
                        {buyer.lastName || "-"}
                      </td>
                      <td className="p-2 text-center">
                        {buyer.confirmed ? "✅" : "❌"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="p-4 text-center text-gray-500">
                      {searchTerm ? "موردی یافت نشد" : "لیست خریداران خالی است"}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </WithRole>
  );
}

export default BuyersPage;
