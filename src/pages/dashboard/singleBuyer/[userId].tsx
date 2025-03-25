// pages/manager/[userId].tsx
import { useRouter } from "next/router";
import { trpc } from "../../../../utils/trpc";
import { FaArrowLeftLong } from "react-icons/fa6";
import Loading from "@/components/ui/Loading";
import { MdOutlinePersonAdd } from "react-icons/md";
import RoundButton from "@/components/ui/RoundButton";
import HeadOfPages from "@/components/ui/HeadOfPages";
import Image from "next/image";

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
    <div className=" w-full min-h-screen">
      <HeadOfPages
        title="اجاره کننده"
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

      {buyer && (
        <div className=" m-5">
          <h2>
            Buyer: {buyer.firstName} {buyer.lastName}
          </h2>
          <p>Phone: {buyer.phone}</p>
          <p>ID Number: {buyer.IDnumber}</p>
          {/* Add buyer orders here */}
          {buyer?.idCardImage && (
            <Image
              src={buyer?.idCardImage[0]}
              alt={buyer?.lastName}
              width={200}
              height={200}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default UserDetailsPage;
