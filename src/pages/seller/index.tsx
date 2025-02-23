import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CustomButton from "../../components/ui/CustomButton";
import { useTranslation } from "react-i18next";

const SellerHomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { t } = useTranslation();

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
    <div className="min-h-screen p-6">
      <div className="max-w-4xl mx-auto p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Seller Dashboard</h1>

        {/* Seller Information */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <p className="mt-1 text-lg text-gray-900">{session?.user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <p className="mt-1 text-lg text-gray-900">{session?.user?.email}</p>
          </div>
        </div>

        {/* Buttons */}
        <CustomButton
          title={t("rent.productCreation")}
          type="primary-btn"
          onClick={() => router.push("/seller/createProduct")}
        />
        <CustomButton
          title={t("rent.products")}
          type="primary-btn"
          onClick={() => {
            console.log("Navigating to /seller/products");
            router.push("/seller/products");
          }}
        />
        <CustomButton
          title={t("rent.orders")}
          type="primary-btn"
          onClick={() => router.push("/seller/orders")}
        />

        {/* Sign Out Button */}
        <div className="mt-8">
          <CustomButton
            type="alert-btn"
            title={t("rent.logout")}
            onClick={handleSignOut}
          />
        </div>
      </div>
    </div>
  );
};

export default SellerHomePage;
