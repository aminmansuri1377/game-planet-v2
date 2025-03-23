import AuthForm from "@/components/form/AuthForm";
import React from "react";

function signIn() {
  return (
    <div>
      <AuthForm userType="seller" formType="signIn" />{" "}
    </div>
  );
}

export default signIn;
