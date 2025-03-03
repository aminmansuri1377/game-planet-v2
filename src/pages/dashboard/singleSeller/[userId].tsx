// pages/manager/[userId].tsx
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { FaArrowLeftLong } from "react-icons/fa6";
import Loading from "@/components/ui/Loading";

const UserDetailsPage = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  // Extract userId and userType from the query
  const { userId } = router.query;

  const { data: seller } = trpc.main.getSellerById.useQuery({
    userId: Number(userId),
  });

  if (!seller) {
    return (
      <div>
        <Loading />
      </div>
    );
  }

  return (
    <div>
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <h1>User Details</h1>
      {seller && (
        <div>
          <h2>
            Seller: {seller.firstName} {seller.lastName}
          </h2>
          <p>Phone: {seller.phone}</p>
          <p>ID Number: {seller.IDnumber}</p>
          {/* Add seller products and orders here */}
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
