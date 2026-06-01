"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { FlexRow } from "@/components/ui/layouts";
import { authResource, VerifyEmailPayload } from "@/features/auth/services";
import useAuthStore from "@/store/auth";

import VerificationFailed from "../components/Verification/VerificationFailed";
import EmailVerified from "../components/Verification/Verified";
import EmailVerifying from "../components/Verification/Verifying";

export default function EmailVerification() {
  const { token } = useParams();
  const router = useRouter();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");

  useEffect(() => {
    setIsPageLoaded(true);
    return () => {
      setIsPageLoaded(false);
    };
  }, []);

  const { mutate: mutateVerifyEmail, isPending: isEmailVerifying } =
    authResource.useApiMutation<VerifyEmailPayload>({
      pathKey: "verifyEmail",
      options: {
        onSuccess: () => {
          if (!isPageLoaded) return;
          setTimeout(() => {
            setVerificationStatus("success");
          }, 1000);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        },
        onError: (error: any) => {
          if (!isPageLoaded) return;
          const caughtError = error?.response?.data;
          if (caughtError?.verificationStatus === "failed") {
            setTimeout(() => {
              setVerificationStatus("error");
            }, 1000);
            return;
          }
        },
      },
    });

  useEffect(() => {
    if (token) {
      const tokenString = Array.isArray(token) ? token[0] : token;
      mutateVerifyEmail({ token: tokenString });
    }
  }, [mutateVerifyEmail, token]);
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, router]);

  const getVerificationStatus = () => {
    if (isEmailVerifying || verificationStatus === "pending") {
      return <EmailVerifying />;
    } else if (verificationStatus === "success") {
      return <EmailVerified />;
    } else {
      return <VerificationFailed />;
    }
  };
  return (
    <FlexRow className="flex h-[calc(100vh-3.15rem)] items-center justify-center bg-purple-50 px-2 max-sm:h-[calc(100vh-2.55rem)]">
      {getVerificationStatus()}
    </FlexRow>
  );
}
