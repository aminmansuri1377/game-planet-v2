import Box from "../../../components/Box";
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { IoPersonSharp } from "react-icons/io5";
import { FaArrowLeftLong } from "react-icons/fa6";
import { FaShoppingBasket } from "react-icons/fa";
import { SlLocationPin } from "react-icons/sl";
import { IoSettingsOutline } from "react-icons/io5";
import { BiSupport } from "react-icons/bi";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { sessionAtom } from "../../../../store/atoms/sessionAtom";
import { useRecoilValue } from "recoil";
import Button from "../../../components/Button";
import Loading from "../../../components/ui/Loading";
import { trpc } from "../../../../utils/trpc";
import { isProfileComplete } from "../../../../utils/checkProfileCompletion";
import Image from "next/image";
import HeadOfPages from "@/components/ui/HeadOfPages";
import RoundButton from "@/components/ui/RoundButton";
import { WithRole } from "@/components/auth/WithRole";
function profile() {
  const { t } = useTranslation();
  const { data: session, status } = useSession();
  const setSession = useSetRecoilState(sessionAtom);
  const resetSession = useResetRecoilState(sessionAtom);
  const userId = session?.user?.id ? parseInt(session.user.id, 10) : null;

  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const {
    data: seller,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getSellerById.useQuery(
    { userId: userId! },
    { enabled: !!userId }
  );
  useEffect(() => {
    if (session) {
      setSession(session);
    }
  }, [session, setSession]);
  const userData = useRecoilValue(sessionAtom);
  // console.log("dataaaa", userData && userData);
  const handleSignOut = async () => {
    resetSession();
    await signOut({ redirect: false });
    router.push("/");
  };
  const images = seller && seller.profileImage;

  const imageArray = Array.isArray(images) ? images : images;
  if (status === "loading") {
    return <Loading />;
  }
  if (!session) {
    return (
      <div className=" min-h-screen font-PeydaBold my-20">
        <div onClick={handleBack} className=" m-5">
          <FaArrowLeftLong />
        </div>
        <div>لطفا وارد شوید</div>
      </div>
    );
  }
  console.log("seller", seller);
  return (
    <WithRole allowedRoles={["seller"]}>
      <div className="w-full min-h-screen text-center">
        <HeadOfPages
          title="پروفایل"
          back={
            <div onClick={handleBack} className=" m-5">
              <FaArrowLeftLong />
            </div>
          }
          icon={
            <div className="w-20 text-center mx-auto">
              <div>
                {seller &&
                  seller?.profileImage &&
                  seller?.profileImage.length !== 0 && (
                    <Image
                      src={seller?.profileImage[0]}
                      alt={`Slide`}
                      className="w-full h-auto object-cover rounded-full"
                      width={200}
                      height={100}
                      loading="lazy"
                    />
                  )}
              </div>
            </div>
          }
        />
        {seller && (
          <div className=" text-center mt-14">
            <h1 className=" font-PeydaBlack ">
              {seller.firstName}
              {seller.lastName}
            </h1>
            <h1 className=" font-PeydaBlack ">
              {session && session?.user?.phone}
            </h1>
            <h1 className=" font-PeydaBlack ">{seller.IDnumber}</h1>
            {/* <h2 className=" my-1"> {session && session?.user?.id}</h2> */}
          </div>
        )}

        <div className="flex justify-evenly">
          <div onClick={() => router.push("./MyAddresses")}>
            <Box lessPaddingY>
              <SlLocationPin size={50} className=" mx-auto mt-8" />
              <h1 className=" font-PeydaBold my-2">{t("rent.myAddresses")}</h1>
              <h2 className=" font-PeydaThin text-[12px] mb-8 mx-1">
                {t("rent.savedAddresses")}
              </h2>
            </Box>
          </div>
        </div>
        {!isProfileComplete(seller) && (
          <div
            onClick={() => router.push("./seller/completeProfile")}
            className=" mx-7"
          >
            <Box lessPaddingY>
              <div className=" flex items-center justify-end">
                <h1 className=" font-PeydaBold mr-2">تکمیل پروفایل</h1>
                <IoSettingsOutline size={30} />
              </div>
            </Box>
          </div>
        )}
        <Button onClick={handleSignOut}>{t("rent.logout")}</Button>
      </div>
    </WithRole>
  );
}

export default profile;
