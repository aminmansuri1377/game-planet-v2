import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CustomButton from "../../components/ui/CustomButton";
import { useTranslation } from "react-i18next";
import { trpc } from "../../../utils/trpc";
import { isProfileComplete } from "../../../utils/checkProfileCompletion";
import SellerHeader from "@/components/SellerHeader";
import Image from "next/image";
import { LiaClipboardListSolid } from "react-icons/lia";
import { AiFillProduct } from "react-icons/ai";
import { GoPlusCircle } from "react-icons/go";
import { WithRole } from "@/components/auth/WithRole";

const SellerHomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;
  console.log("first", session);
  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getSellerById.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );
  // Redirect if the user is not authenticated or not a seller
  // useEffect(() => {
  //   if (status === "unauthenticated" || session?.user?.role !== "SELLER") {
  //     console.log("Redirecting to /signIn");
  //     router.push("/signIn");
  //   }
  // }, [session, status, router]);

  if (status === "loading") {
    return <div>Loading...</div>; // Show a loading state while checking the session
  }
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };
  return (
    <WithRole allowedRoles={["seller"]}>
      <div className="min-h-screen px-6">
        <SellerHeader />
        <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-md">
          {/* Seller Information */}
          {seller && (
            <div className="space-y-4">
              <div
                className=" bg-cardbg rounded-full p-1 flex justify-end"
                onClick={() => {
                  router.push("/seller/profile");
                }}
              >
                <p className="text-lg text-text1 m-2">
                  {seller?.firstName}
                  {seller?.lastName}
                </p>
                <div>
                  {seller?.profileImage && (
                    <Image
                      src={seller?.profileImage[0]}
                      alt={seller?.id}
                      width={50}
                      height={50}
                      className=" rounded-full"
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Buttons */}
          <div className=" flex gap-4 my-4 justify-center">
            <div
              className=" py-4 px-7 rounded-lg bg-cardbg"
              onClick={() => {
                router.push("/seller/products");
              }}
            >
              <AiFillProduct size={70} />
              <h1 className=" font-PeydaBold my-3">{t("rent.products")}</h1>
            </div>
            <div
              className=" py-4 px-7 rounded-lg bg-cardbg"
              onClick={() => router.push("/seller/orders")}
            >
              <LiaClipboardListSolid size={70} />
              <h1 className=" font-PeydaBold my-3">{t("rent.orders")}</h1>
            </div>
          </div>
          <div
            className=" py-4 px-7 rounded-lg bg-cardbg flex justify-end"
            onClick={() => router.push("/seller/createProduct")}
          >
            <h1 className=" font-PeydaBold mt-1 mx-2">
              {t("rent.productCreation")}
            </h1>
            <GoPlusCircle size={35} />
          </div>
          {!isProfileComplete(seller) && (
            <CustomButton
              title="تکمیل پروفایل"
              type="primary-btn"
              onClick={() => router.push("/seller/completeProfile")}
              className=" text-center mx-auto my-5"
            />
          )}
          {/* <CustomButton
          title="setting"
          type="primary-btn"
          onClick={() => router.push("/seller/setting")}
        />
         */}
        </div>
      </div>
    </WithRole>
  );
};
//export const dynamic = "force-dynamic";

export default SellerHomePage;
