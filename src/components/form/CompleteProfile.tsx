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
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CustomButton from "../ui/CustomButton";
import { trpc } from "../../../utils/trpc";
import Uploader from "../uploader/Uploader";

// Zod schema for form validation
const ProfileFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  IDnumber: z.string().min(1, "ID number is required"),
});

type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

interface CompleteProfileProps {
  userId: number;
  userType: "buyer" | "seller";
}

const CompleteProfile = ({ userId, userType }: CompleteProfileProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // tRPC mutations
  const completeBuyerProfile = trpc.main.completeBuyerProfile.useMutation();
  const completeSellerProfile = trpc.main.completeSellerProfile.useMutation();

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(ProfileFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      IDnumber: "",
    },
  });

  const onSubmit = async (values: ProfileFormValues) => {
    setIsLoading(true);
    try {
      let response;
      if (userType === "buyer") {
        response = await completeBuyerProfile.mutateAsync({
          userId,
          idCardImage: imageUrls,
          ...values,
        });
      } else {
        response = await completeSellerProfile.mutateAsync({
          userId,
          idCardImage: imageUrls,
          ...values,
        });
      }

      if (response) {
        toast.success("پروفایل بروززسانی شد!");
        const currentPath = window.location.pathname;
        if (currentPath.includes("/seller")) {
          router.push("/seller");
        } else {
          router.push("/profile");
        }
      }
    } catch (error) {
      toast.error("مشکلی در بروزرسانی وجود دارد");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 font-PeydaBold">
        تکمیل حساب کاربری
      </h1>
      <h1 className="font-PeydaRegular">عکس کارت ملی</h1>
      <Uploader
        onUpload={(urls) => setImageUrls(urls)}
        bucket="idcard"
        singleUpload={true}
      />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 text-center font-PeydaRegular"
        >
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>نام</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="">نام خانوادگی</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="IDnumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>کد ملی</FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <CustomButton
            type="primary-btn"
            loading={isLoading}
            className="w-full"
            title="تایید"
            disabled={!imageUrls}
          />
        </form>
      </Form>
    </div>
  );
};

export default CompleteProfile;
