import SignInForm from "@/components/form/SignInForm";
import React from "react";
import { useTranslation } from "react-i18next";

function signIn() {
  return (
    <div>
      <SignInForm />
    </div>
  );
}

export default signIn;
