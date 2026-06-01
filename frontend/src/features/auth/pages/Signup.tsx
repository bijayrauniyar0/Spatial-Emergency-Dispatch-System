"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { Input, Label } from "@/components/ui/form";
import PasswordInput from "@/components/ui/form/password-input";
import { FlexColumn } from "@/components/ui/layouts";
import { authResource, SignupPayload } from "@/features/auth/services";
import { signupValidation } from "@/features/auth/validations";
import useAuthStore from "@/store/auth";

const defaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const SignupForm = () => {
  const router = useRouter();
  const setUserProfile = useAuthStore((state) => state.setUserProfile);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues,
    resolver: zodResolver(signupValidation),
  });

  const { mutate, isPending } = authResource.useApiMutation<SignupPayload>({
    pathKey: "register",
    options: {
      onSuccess: () => {
        setUserProfile({
          email: getValues("email"),
          name: getValues("name"),
        });
        toast.success("Account created successfully");
        router.push("/verify-email");
      },
      onError: (error: any) => {
        const caughtError = error?.response?.data?.message;
        toast.error(caughtError || "Signup Failed Something Went Wrong");
      },
    },
  });

  const onSubmit = (data: any) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...payload } = data;
    mutate(payload);
  };

  return (
    <div className="login-inner grid h-full place-items-center">
      <div className="login-form w-full space-y-8 overflow-hidden p-7 text-center sm:min-w-[25.25rem] sm:px-12 lg:px-16">
        <p className="text-primary text-5xl font-semibold select-none">
          MockSewa
        </p>

        <form onSubmit={handleSubmit(onSubmit)}>
          <FlexColumn className="gap-4">
            <FlexColumn className="gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                {...register("name", {
                  required: "Name is required",
                  minLength: {
                    value: 2,
                    message: "Name must be at least 2 characters",
                  },
                })}
              />
              {errors?.name?.message && (
                <ErrorMessage message={errors.name.message} />
              )}
            </FlexColumn>

            <FlexColumn className="gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email", {
                  required: "Email is required",
                })}
              />
              {errors?.email?.message && (
                <ErrorMessage message={errors.email.message} />
              )}
            </FlexColumn>

            <FlexColumn className="gap-2">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                {...register("password", {
                  required: "Password is required",
                })}
              />
              {errors?.password?.message && (
                <ErrorMessage message={errors.password.message} />
              )}
            </FlexColumn>

            <FlexColumn className="gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <PasswordInput
                id="confirmPassword"
                placeholder="Confirm your password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                })}
              />
              {errors?.confirmPassword?.message && (
                <ErrorMessage message={errors.confirmPassword.message} />
              )}
            </FlexColumn>
          </FlexColumn>

          <FlexColumn className="w-full items-center justify-center gap-6 pt-6">
            <Button className="w-full p-3" disabled={isPending} type="submit">
              {isPending ? "Creating Account..." : "Sign Up"}
            </Button>
            <p className="text-center text-sm">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-primary font-semibold hover:underline"
              >
                Login Here
              </Link>
            </p>
          </FlexColumn>
        </form>
      </div>
    </div>
  );
};

export default SignupForm;
