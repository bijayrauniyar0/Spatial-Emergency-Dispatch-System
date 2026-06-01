import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import {
  authResource,
  ForgotPasswordPayload,
  ResendVerificationEmailPayload,
} from "@/features/auth/services";

export const useSendPasswordResetEmail = () => {
  const { mutate, isPending, isSuccess } =
    authResource.useApiMutation<ForgotPasswordPayload>({
      pathKey: "forgotPassword",
      options: {
        onError: (error: any) => {
          toast.error(
            error?.response?.data?.message ||
              "Something went wrong. Please try again.",
          );
        },
        onSuccess: () => {
          toast.success("Password reset email sent successfully.");
        },
      },
    });

  return {
    mutate,
    isPending,
    isSuccess,
  };
};

export const useSendVerificationEmail = () => {
  const router = useRouter();
  const [timerValue, setTimerValue] = useState(0);

  const handleTimerUpdate = (value: number) => {
    setTimerValue(value);
  };

  const { mutate, isPending } =
    authResource.useApiMutation<ResendVerificationEmailPayload>({
      pathKey: "resendVerificationEmail",
      options: {
        onSuccess: () => {
          toast.success("Verification email sent successfully.");
          setTimerValue((prev) => prev + 120);
        },
        onError: (error: any) => {
          const caughtError = error?.response?.data;
          const errorMessage = caughtError?.message;
          const isVerified = caughtError?.isVerified;
          const userFound = caughtError?.userFound;

          if (isVerified === true) {
            toast.error(
              errorMessage || "Email already verified. Please login.",
            );
            router.push("/login");
            return;
          }

          if (userFound === false) {
            toast.error(errorMessage || "User not found. Please sign up.");
            router.push("/login");
            return;
          }

          if (isVerified === false && userFound === true) {
            toast.error(errorMessage || "Failed to send verification email.");
            return;
          }
        },
      },
    });

  return {
    mutate,
    isPending,
    timerValue,
    handleTimerUpdate,
  };
};
