"use client";
import { CircleCheckBig } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import CountdownTimer from "@/components/common/CountdownTimer";
import { Button } from "@/components/ui/button";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";
import useAuthStore from "@/store/auth";

import { useSendVerificationEmail } from "../api";

export default function VerifyEmail() {
  const router = useRouter();
  const userProfile = useAuthStore((state) => state.userProfile);

  useEffect(() => {
    if (!userProfile?.email) {
      router.push("/login");
    }
    const listener = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", listener);

    return () => {
      window.removeEventListener("beforeunload", listener);
    };
  }, [router, userProfile?.email]);

  const {
    mutate: sendVerificationEmail,
    isPending: sendingVerificationEmail,
    timerValue,
    handleTimerUpdate,
  } = useSendVerificationEmail();

  const handleRequestNewLink = () => {
    if (!userProfile?.email) return;
    sendVerificationEmail({
      email: userProfile.email,
    });
  };

  return (
    <FlexRow className="h-full items-center justify-center px-4">
      <FlexColumn className="items-center justify-center gap-6">
        <p className="text-primary text-5xl font-semibold select-none">
          MockSewa
        </p>
        <FlexColumn className="w-full gap-6 rounded-lg bg-white p-6 text-center">
          <div className="mx-auto h-fit w-fit rounded-full bg-green-100 p-2">
            <CircleCheckBig className="mx-auto h-10 w-10 text-green-500" />
          </div>
          <FlexColumn className="w-full gap-6">
            <FlexColumn className="gap-2">
              <p className="text-lg font-semibold text-gray-700">
                Verification email sent!
              </p>
              <p className="text-base font-medium text-gray-600">
                Please check your inbox to complete your registration
              </p>
            </FlexColumn>
            <FlexColumn className="w-full items-center justify-center gap-1">
              <p className="text-md text-gray-500">Didn’t receive the email?</p>
              {timerValue !== 0 && (
                <p className="text-md text-gray-500">
                  You can request a new link in{" "}
                  <CountdownTimer
                    minutes={Math.floor(timerValue / 60)}
                    seconds={timerValue % 60}
                    onComplete={() => handleTimerUpdate(0)}
                  />
                </p>
              )}
            </FlexColumn>
            <Button
              disabled={timerValue > 0 || sendingVerificationEmail}
              onClick={handleRequestNewLink}
              className="mx-auto w-fit"
            >
              Request New Link
            </Button>
          </FlexColumn>
        </FlexColumn>
        <p className="items-center text-sm text-gray-500">
          © {new Date().getFullYear()} MockSewa. All rights reserved.
        </p>
      </FlexColumn>
    </FlexRow>
  );
}
