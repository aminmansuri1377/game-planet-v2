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
import { toast } from "react-hot-toast";
import ToastContent from "../ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";

const BuyerSignUpForm = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { t } = useTranslation();

  const FormSchema = z.object({
    phone: z
      .string()
      .length(11, t("rent.usernameRequired")) // Ensures exactly 11 characters
      .regex(/^\d{11}$/, t("rent.usernameRequired")), // Ensures only digits
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/buyer", {
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
        router.push("/signIn");
      } else {
        const errorData = await response.json();
        toast.custom(
          <ToastContent
            type="error"
            message={errorData.message || "Failed to sign up"}
          />
        );
      }
    } catch (error) {
      toast.custom(<ToastContent type="error" message="Unexpected error" />);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div onClick={handleBack} className="mt-8">
        <FaArrowLeftLong />
      </div>
      <div className="content-center min-h-screen ">
        <div className=" bg-cardbg px-8 pb-24 pt-10 rounded-xl  ">
          <Form {...form}>
            <h1 className=" font-PeydaBlack text-text2 text-center my-5">
              ورود{" "}
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
              <CustomButton
                className="w-full mt-6"
                type="primary-btn"
                title={t("rent.signUp")}
                loading={isLoading}
              ></CustomButton>
            </form>
            <div className="mx-auto my-4 flex w-full items-center font-PeydaMedium justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              یا
            </div>
            <p className="text-center text-sm text-white mt-2 font-PeydaRegular">
              {t("rent.loginPrompt")}{" "}
              <Link
                className="text-blue-500 hover:underline mx-1 font-PeydaBlack"
                href="/signIn"
              >
                {t("rent.login")}
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignUpForm;
