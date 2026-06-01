"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Label } from "@/components/ui/form";
import { Input } from "@/components/ui/form/input";
import PasswordInput from "@/components/ui/form/password-input";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";
import { authResource, LoginPayload } from "@/features/auth/services";
import { apiURL } from "@/services/index";
import useAuthStore from "@/store/auth";

const initialState = {
  email: "",
  password: "",
  // keepSignedIn: false,
};

export default function Login() {
  const router = useRouter();
  const setUserProfile = useAuthStore((state) => state.setUserProfile);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const {
    register,
    handleSubmit,
    watch,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm({
    defaultValues: initialState,
  });

  const { mutate, isPending } = authResource.useApiMutation<LoginPayload>({
    pathKey: "login",
    options: {
      onSuccess: (res: any) => {
        setUserProfile(res.user || res.data?.user);
        setIsAuthenticated(true);
        toast.success("Login successful");
        router.push("/");
      },
      onError: (error: any) => {
        if (
          error?.response?.status === 401 &&
          error?.response?.data?.verified === false
        ) {
          setUserProfile({ email: watch("email") });
          router.push("/verify-email");
          return;
        }
        const caughtError = error?.response?.data?.message;
        if (caughtError) {
          setError("email", {
            type: "manual",
            message: caughtError,
          });
          toast.error(caughtError);
        } else {
          toast.error("Login failed");
        }
      },
    },
  });

  const email = watch("email");
  useEffect(() => {
    if (errors?.email?.type === "manual") {
      clearErrors("email");
    }
  }, [email, errors, clearErrors]);

  const onSubmit = (data: Record<string, any>) => {
    mutate(data);
  };
  const handleLogin = () => {
    window.location.href = `${apiURL}/auth/google`;
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FlexColumn className="gap-3">
          <FlexColumn className="gap-1">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="text"
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

          <FlexColumn className="gap-1">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              className="w-[4/5] pr-10"
              placeholder="Enter Password"
              {...register("password", {
                required: "Password is Required",
              })}
            />
            {errors?.password?.message && (
              <ErrorMessage message={errors.password.message} />
            )}
          </FlexColumn>
        </FlexColumn>

        <div className="flex items-center justify-end gap-2">
          <Link
            className="text-primary cursor-pointer px-2 text-sm"
            href="/forgot-password"
          >
            Forgot Password ?
          </Link>
        </div>

        <FlexColumn className="w-full items-center justify-center gap-3">
          <Button
            className="mt-2 w-full p-3"
            disabled={isPending}
            type="submit"
          >
            Sign In
          </Button>
          <p className="text-center text-sm">
            Don&apos;t have an account ?{" "}
            <Link
              href="/signup"
              className="text-primary font-semibold hover:underline"
            >
              Register Here
            </Link>
          </p>
        </FlexColumn>
      </form>

      <FlexColumn className="mt-2 items-start gap-3">
        <FlexRow className="w-full items-center justify-between gap-2">
          <div className="h-px w-2/5 bg-gray-300" />
          <p className="text-center">Or</p>
          <div className="h-px w-2/5 bg-gray-300" />
        </FlexRow>
        <button
          onClick={handleLogin}
          className="mx-auto flex items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-gray-700 shadow-sm transition-colors hover:bg-gray-100"
        >
          <Image
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="h-5 w-5"
            width={20}
            height={20}
          />
          <span>Continue with Google</span>
        </button>
      </FlexColumn>
    </>
  );
}
