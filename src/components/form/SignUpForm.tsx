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

const SignUpForm = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const { t } = useTranslation();

  // Determine the role based on the route
  const getRoleFromRoute = () => {
    if (router.pathname.includes("/seller/signUp")) {
      return "SELLER";
    } else if (router.pathname.includes("/dashboard/signUp")) {
      return "APP_MANAGER";
    } else {
      return "BUYER";
    }
  };

  const FormSchema = z
    .object({
      username: z.string().min(1, t("rent.usernameRequired")).max(100),
      email: z
        .string()
        .min(1, t("rent.emailRequired"))
        .email(t("rent.invalidEmail")),
      password: z
        .string()
        .min(1, t("rent.passwordRequired"))
        .min(8, t("rent.passwordMinLength")),
      confirmPassword: z.string().min(1, "Password confirmation is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: "Password do not match",
    });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
          role: getRoleFromRoute(), // Get the role based on the route
          username: values.username,
        }),
      });

      if (response.ok) {
        toast.custom(
          <ToastContent type="success" message="User created successfully!" />
        );
        // Redirect based on the role
        if (getRoleFromRoute() === "BUYER") {
          router.push("/signIn");
        } else if (getRoleFromRoute() === "SELLER") {
          router.push("/seller/signIn");
        } else if (getRoleFromRoute() === "APP_MANAGER") {
          router.push("/dashboard/signIn");
        }
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
      <div onClick={handleBack}>
        <FaArrowLeftLong />
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
          <div className="space-y-2 font-PeydaBold text-end">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rent.username")}</FormLabel>
                  <FormControl>
                    <Input placeholder="امین منصوری" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rent.email")}</FormLabel>
                  <FormControl>
                    <Input placeholder="mail@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rent.password")}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={t("rent.enterPassword")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("rent.repeatPassword")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("rent.reenterPassword")}
                      type="password"
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
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
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
  );
};

export default SignUpForm;
