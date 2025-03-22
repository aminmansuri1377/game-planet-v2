import Box from "../../components/Box";
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
import { sessionAtom } from "../../../store/atoms/sessionAtom";
import { useRecoilValue } from "recoil";
import Button from "../../components/Button";
import Loading from "../../components/ui/Loading";
import { trpc } from "../../../utils/trpc";
import { isProfileComplete } from "../../../utils/checkProfileCompletion";
import Image from "next/image";
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
    data: buyer,
    isLoading: isSellerLoading,
    error: sellerError,
  } = trpc.main.getBuyerById.useQuery(
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
  const images = buyer && buyer.profileImage;

  const imageArray = Array.isArray(images) ? images : images;
  if (status === "loading") {
    return <Loading />;
  }
  if (!session) {
    return <div>Please log in</div>;
  }
  console.log("buyer", buyer);
  return (
    <div className="w-full">
      <Box>
        <div className="flex justify-between items-center mx-5">
          <div onClick={handleBack}>
            <FaArrowLeftLong />
          </div>
          <div className="flex rounded-full bg-gradient-to-tr shadow-xl shadow-purple-800 from-[#9E16BD] to-[#5F1470] p-3 items-center text-center">
            <IoPersonSharp size={34} className="text-gray-300" />
          </div>
          {!images && Array.isArray(images) && images.length === 0 ? (
            <div className=" mx-auto flex items-center justify-center bg-gray-100 rounded-2xl shadow-lg">
              <p className="text-gray-500">No images available</p>
            </div>
          ) : (
            <div>
              {imageArray &&
                imageArray.map((image, index) => (
                  <div key={index} className="min-w-full">
                    <Image
                      src={image}
                      alt={`Slide ${index + 1}`}
                      className="w-full h-auto object-cover rounded-full"
                      width={200}
                      height={100}
                      loading="lazy"
                    />
                  </div>
                ))}
            </div>
          )}
          <div></div>
        </div>
        <h1 className=" font-PeydaBlack mt-5">
          {session && session?.user?.phone}
        </h1>
        <h2 className=" my-1"> {session && session?.user?.id}</h2>
        {/* <h2 className=" mb-3"> {session && session?.user?.email}</h2> */}
        <div className="flex justify-evenly">
          <div onClick={() => router.push("./profile/basket")}>
            <Box lessPaddingY>
              <FaShoppingBasket size={50} className=" mx-auto mt-8" />
              <h1 className=" font-PeydaBold my-2">{t("rent.myCart")}</h1>
              <h2 className=" font-PeydaThin text-[12px] mb-8 mx-1">
                {t("rent.orderHistory")}{" "}
              </h2>
            </Box>
          </div>
          <div onClick={() => router.push("./profile/MyAddresses")}>
            <Box lessPaddingY>
              <SlLocationPin size={50} className=" mx-auto mt-8" />
              <h1 className=" font-PeydaBold my-2">{t("rent.myAddresses")}</h1>
              <h2 className=" font-PeydaThin text-[12px] mb-8 mx-1">
                {t("rent.savedAddresses")}
              </h2>
            </Box>
          </div>
        </div>
        <div onClick={() => router.push("./profile/setting")}>
          <Box lessPaddingY>
            <div className=" flex items-center justify-end">
              <h1 className=" font-PeydaBold mr-2">{t("rent.settings")}</h1>
              <IoSettingsOutline size={30} />
            </div>
          </Box>
        </div>
        {!isProfileComplete(buyer) && (
          <div onClick={() => router.push("./profile/CompleteProfile")}>
            <Box lessPaddingY>
              <div className=" flex items-center justify-end">
                <h1 className=" font-PeydaBold mr-2">CompleteProfile</h1>
                <IoSettingsOutline size={30} />
              </div>
            </Box>
          </div>
        )}

        <div onClick={() => router.push("./profile/SavedProductsPage")}>
          <Box lessPaddingY>
            <div className=" flex items-center justify-end">
              <h1 className=" font-PeydaBold mr-2">SavedProductsPage</h1>
              <IoSettingsOutline size={30} />
            </div>
          </Box>
        </div>
        <Box lessPaddingY>
          <div className=" flex items-center justify-end">
            <h1 className=" font-PeydaBold mr-2">{t("rent.support")}</h1>
            <BiSupport size={30} />
          </div>
        </Box>
        <Button onClick={handleSignOut}>{t("rent.logout")}</Button>
      </Box>
    </div>
  );
}

export default profile;
