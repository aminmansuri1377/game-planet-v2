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

const BuyerSignInForm = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const handleBack = () => {
    router.back();
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

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsLoading(true); // Start loading
    try {
      const signInData = await signIn("credentials", {
        phone: values.phone,
        redirect: false,
      });

      if (signInData?.error) {
        toast.custom(<ToastContent type="error" message={signInData?.error} />);
      } else {
        const response = await fetch("/api/auth/session");
        const session = await response.json();
        if (session) {
          router.push("/");
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
      <div onClick={handleBack} className="mt-8">
        <FaArrowLeftLong />
      </div>
      <div className="content-center min-h-screen ">
        <div className=" bg-cardbg px-8 pb-24 pt-10 rounded-xl  ">
          <Form {...form}>
            <h1 className=" font-PeydaBlack text-text2 text-center my-5">
              ثبت نام
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
                title={t("rent.login")}
                loading={isLoading}
              ></CustomButton>
            </form>
            <div className="mx-auto my-4 flex w-full font-PeydaMedium items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
              یا
            </div>
            <p className="text-center text-sm text-white mt-2 font-PeydaRegular">
              {t("rent.signUpPrompt")}{" "}
              <Link
                className="text-blue-500 hover:underline font-PeydaBlack mx-1"
                href="/signUp"
              >
                {t("rent.signUp")}
              </Link>
            </p>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default BuyerSignInForm;
