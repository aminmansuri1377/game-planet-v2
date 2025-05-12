import AuthForm from "@/components/form/AuthForm";
import React from "react";

function signIn() {
  return (
    <div>
      <AuthForm userType="buyer" formType="signIn" />
    </div>
  );
}
//export const dynamic = "force-dynamic";

export default signIn;
