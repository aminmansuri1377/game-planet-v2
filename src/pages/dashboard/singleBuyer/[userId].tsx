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

  // Fetch buyer or seller based on userType
  const { data: buyer } = trpc.main.getBuyerById.useQuery({
    userId: Number(userId),
  });

  if (!buyer) {
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
      {buyer && (
        <div>
          <h2>
            Buyer: {buyer.firstName} {buyer.lastName}
          </h2>
          <p>Phone: {buyer.phone}</p>
          <p>ID Number: {buyer.IDnumber}</p>
          {/* Add buyer orders here */}
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
