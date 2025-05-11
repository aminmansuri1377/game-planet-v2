import AuthForm from "@/components/form/AuthForm";
import React from "react";

function signUp() {
  return (
    <div>
      <AuthForm userType="seller" formType="signUp" />{" "}
    </div>
  );
}
export const dynamic = "force-dynamic";

export default signUp;
