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
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import CustomButton from "../ui/CustomButton";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-hot-toast";
import ToastContent from "../ui/ToastContent";
import { FaArrowLeftLong } from "react-icons/fa6";

const SignInForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  // Determine the sign-up route based on the current route
  const getSignUpRoute = () => {
    if (router.pathname.includes("/dashboard/signIn")) {
      return "/dashboard/signUp";
    } else if (router.pathname.includes("/seller/signIn")) {
      return "/seller/signUp";
    } else {
      return "/signUp";
    }
  };

  const FormSchema = z.object({
    email: z
      .string()
      .min(1, t("rent.emailRequired"))
      .email(t("rent.invalidEmail")),
    password: z
      .string()
      .min(1, t("rent.passwordRequired"))
      .min(8, t("rent.passwordMinLength")),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true); // Start loading
    try {
      const signInData = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (signInData?.error) {
        toast.custom(<ToastContent type="error" message={signInData?.error} />);
      } else {
        // Fetch the user's role from the session
        const response = await fetch("/api/auth/session");
        const session = await response.json();

        if (session?.user?.role === "BUYER") {
          router.push("/"); // Redirect to home page for buyers
        } else if (session?.user?.role === "SELLER") {
          router.push("/seller"); // Redirect to seller dashboard
        } else if (session?.user?.role === "APP_MANAGER") {
          router.push("/dashboard"); // Redirect to app manager dashboard
        } else {
          router.push("/"); // Default fallback
        }
      }
    } catch (error) {
      toast.custom(<ToastContent type="error" message={String(error)} />);
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
          </div>
          <CustomButton
            className="w-full mt-6"
            type="primary-btn"
            title={t("rent.login")}
            loading={isLoading}
          ></CustomButton>
        </form>
        <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
          or
        </div>
        <p className="text-center text-sm text-white mt-2 font-PeydaRegular">
          {t("rent.signUpPrompt")}{" "}
          <Link
            className="text-blue-500 hover:underline font-PeydaBlack mx-1"
            href={getSignUpRoute()} // Use the dynamic sign-up route
          >
            {t("rent.signUp")}
          </Link>
        </p>
      </Form>
    </div>
  );
};

export default SignInForm;
