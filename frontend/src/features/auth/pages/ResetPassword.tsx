"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Label } from "@/components/ui/form";
import PasswordInput from "@/components/ui/form/password-input";
import { FlexColumn } from "@/components/ui/layouts";
import { authResource, ResetPasswordPayload } from "@/features/auth/services";
import { resetPasswordValidation } from "@/features/auth/validations";

const defaultValues = {
  password: "",
  confirmPassword: "",
  // keepSignedIn: false,
};

export default function ResetPassword() {
  const router = useRouter();
  const { token } = useParams();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(resetPasswordValidation),
  });

  const { mutate, isPending } = authResource.useApiMutation<ResetPasswordPayload>({
    pathKey: "resetPassword",
    options: {
      onSuccess: () => {
        toast.success("Password reset successful. Please login.");
        router.push("/login");
      },
      onError: (error: any) => {
        const caughtError =
          error?.response?.data?.message || "Something went wrong. Please try again.";
        toast.error(caughtError);
      },
    },
  });

  const onSubmit = (data: Record<string, any>) => {
    const { password } = data;
    const payload = {
      password,
      token,
    };
    mutate(payload);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
      <FlexColumn className="gap-2">
        <Label htmlFor="password" className="text-xs">
          Password
        </Label>
        <PasswordInput
          id="password"
          className="w-[4/5] pr-10"
          placeholder="Enter Password"
          {...register("password", { required: "Password is Required" })}
        />

        {errors?.password?.message && (
          <ErrorMessage message={errors.password.message} />
        )}
      </FlexColumn>
      <FlexColumn className="gap-2">
        <Label htmlFor="password" className="text-xs">
          Confirm Password
        </Label>
        <PasswordInput
          id="password"
          className="w-[4/5] pr-10"
          placeholder="Enter Confirm Password"
          {...register("confirmPassword", {
            required: "Password is Required",
          })}
        />

        {errors?.confirmPassword?.message && (
          <ErrorMessage message={errors.confirmPassword.message} />
        )}
      </FlexColumn>
      <Button className="mt-2 w-full p-3" disabled={isPending} type="submit">
        Reset
      </Button>
    </form>
  );
}
