"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Input, Label } from "@/components/ui/form";
import { FlexColumn } from "@/components/ui/layouts";
import { useSendPasswordResetEmail } from "@/features/auth/api";
import useAuthStore from "@/store/auth";

const initialState = {
  email: "",
};

export default function ForgotPassword() {
  const router = useRouter();
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });

  const { mutate, isPending, isSuccess } = useSendPasswordResetEmail();
  useEffect(() => {
    if (isSuccess) {
      const email = getValues("email");
      setUserProfile({ email });
      router.push("/verify-forgot-password");
    }
  }, [isSuccess, getValues, router, setUserProfile]);

  const onSubmit = (data: Record<string, any>) => {
    mutate({ email: data.email });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FlexColumn className="gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email (e.g. bijay@example.com)"
          {...register("email", {
            required: "Email is required",
            pattern: {
              value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
              message: "Invalid email format",
            },
          })}
        />
        {errors?.email?.message && (
          <ErrorMessage message={errors.email.message} />
        )}
      </FlexColumn>
      <Button className="mt-2 w-full p-3" disabled={isPending} type="submit">
        Send Reset Link
      </Button>
    </form>
  );
}
