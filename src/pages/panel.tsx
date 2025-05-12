import AdminPassModal from "../components/AdminPassModal";
import { useRouter } from "next/router";
import React from "react";
import Cookies from "js-cookie";

function panel() {
  const router = useRouter();

  const handleSuccess = () => {
    Cookies.set("dashboardAuth", "authenticated", { expires: 1 });
    router.push("/dashboard/signIn");
  };
  return (
    <div className=" text-end min-h-s">
      <AdminPassModal onSuccess={handleSuccess} />
    </div>
  );
}
//export const dynamic = "force-dynamic";

export default panel;
