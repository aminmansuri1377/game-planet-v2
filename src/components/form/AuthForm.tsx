"use client";

import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import Link from "next/link";
import { useRouter } from "next/router";
import CustomButton from "../ui/CustomButton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import ToastContent from "../ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";
import { signIn } from "next-auth/react";
import CustomModal from "../ui/CustomModal";
import SellerRules from "./SellerRules";
import BuyerRules from "./BuyerRules";
import toast from "react-hot-toast";

interface AuthFormProps {
  userType: "seller" | "buyer";
  formType: "signUp" | "signIn";
}

const AuthForm = ({ userType, formType }: AuthFormProps) => {
  const router = useRouter();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [acceptRules, setAcceptRules] = useState(false);
  const [showRuleModal, setShowRuleModal] = useState(false);

  // Define rules per user type
  const rulesText = {
    seller: <SellerRules />,
    buyer: <BuyerRules />,
  };

  const FormSchema = z.object({
    phone: z
      .string()
      .length(11, t("rent.usernameRequired"))
      .regex(/^\d{11}$/, t("rent.usernameRequired")),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      phone: "",
    },
  });

  const handleBack = () => {
    router.back();
  };

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    if (!acceptRules && formType === "signUp") return;

    setIsLoading(true);
    try {
      if (formType === "signUp") {
        const response = await fetch(`/api/${userType}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            phone: values.phone,
          }),
        });

        if (response.ok) {
          toast.custom(
            <ToastContent type="success" message="User created successfully!" />
          );
          router.push(`${userType === "seller" ? "/seller" : ""}/signIn`);
        } else {
          const errorData = await response.json();
          toast.custom(
            <ToastContent
              type="error"
              message={errorData.message || "Failed to sign up"}
            />
          );
        }
      } else {
        const signInData = await signIn("credentials", {
          phone: values.phone,
          redirect: false,
        });

        if (signInData?.error) {
          toast.custom(
            <ToastContent type="error" message={signInData?.error} />
          );
        } else {
          const response = await fetch("/api/auth/session");
          const session = await response.json();
          if (session) {
            router.push(userType === "seller" ? "/seller" : "/");
          }
        }
      }
    } catch (error) {
      toast.custom(<ToastContent type="error" message="Unexpected error" />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={handleBack} className="mt-8 cursor-pointer">
        <FaArrowLeftLong />
      </div>

      <div className="content-center min-h-screen">
        <div className="bg-cardbg px-8 pb-24 pt-10 rounded-xl">
          <Form {...form}>
            <h1 className="font-PeydaBlack text-text2 text-center my-5">
              {formType === "signUp" ? "ثبت نام" : "ورود"}
            </h1>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
              <div className="space-y-2 font-PeydaBold text-end">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>تلفن</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="شماره تلفن خود را وارد کنید "
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Accept Terms Checkbox - Only for SignUp */}
              {formType === "signUp" && (
                <div className="flex items-start mt-4 font-PeydaMedium text-sm text-white space-x-2 space-x-reverse">
                  <label className=" mx-2">
                    من قوانین را میپذیرم{" "}
                    <span
                      className="text-blue-500 underline cursor-pointer"
                      onClick={() => setShowRuleModal(true)}
                    >
                      مشاهده قوانین
                    </span>
                  </label>
                  <input
                    type="checkbox"
                    id="acceptRules"
                    checked={acceptRules}
                    onChange={(e) => setAcceptRules(e.target.checked)}
                    className="mt-1"
                  />
                </div>
              )}

              <CustomButton
                className="w-full mt-6"
                type="primary-btn"
                title={formType === "signUp" ? "ثبت نام" : "ورود"}
                loading={isLoading}
                disabled={formType === "signUp" && !acceptRules}
              />

              <CustomModal
                show={showRuleModal}
                onClose={() => setShowRuleModal(false)}
                type="general"
              >
                <h3 className="text-lg mb-4 font-PeydaBold">
                  قوانین{" "}
                  {userType === "seller" ? "اجاره دهنده" : "اجاره گیرنده"}
                </h3>
                <p className="text-right whitespace-pre-line">
                  {rulesText[userType]}
                </p>
              </CustomModal>
            </form>

            <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              یا
            </div>

            <p className="text-center text-sm text-white mt-2 font-PeydaRegular">
              {t(
                `rent.${formType === "signUp" ? "loginPrompt" : "signUpPrompt"}`
              )}
              <Link
                className="text-blue-500 hover:underline font-PeydaBlack mx-1"
                href={`${userType === "seller" ? "/seller" : ""}/${
                  formType === "signUp" ? "signIn" : "signUp"
                }`}
              >
                {t(`rent.${formType === "signUp" ? "login" : "signUp"}`)}
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
