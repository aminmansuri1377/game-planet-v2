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

function SellersPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated, isMounted } = useAuthRedirect();
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySellers, setDisplaySellers] = useState<any[]>([]);

  // Fetch all sellers
  const { data: allSellers, isLoading: isLoadingAll } =
    trpc.main.getSellers.useQuery();

  // Fetch searched sellers
  const { data: searchedSellers, isLoading: isLoadingSearch } =
    trpc.main.getSellersByPhone.useQuery(
      { phone: searchTerm },
      {
        enabled: searchTerm.length > 0,
      }
    );

  // Update displaySellers based on search state
  useEffect(() => {
    if (searchTerm.length > 0) {
      setDisplaySellers(searchedSellers || []);
    } else {
      setDisplaySellers(allSellers || []);
    }
  }, [searchTerm, allSellers, searchedSellers]);

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
                {displaySellers.length ? (
                  displaySellers.map((seller) => (
                    <tr key={seller.id} className="border-b hover:bg-gray-50">
                      <td className="p-2 text-right">
                        <Link
                          href={`/dashboard/singleSeller?userId=${seller.id}`}
                          className="text-blue-600 hover:underline"
                        >
                          {seller.phone}
                        </Link>
                      </td>
                      <td className="p-2 text-right">
                        {seller.firstName || "-"}
                      </td>
                      <td className="p-2 text-right">
                        {seller.lastName || "-"}
                      </td>
                      <td className="p-2 text-center">
                        {seller.confirmed ? "✅" : "❌"}
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

export default SellersPage;
