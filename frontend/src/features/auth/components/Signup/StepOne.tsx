"use client";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";

import ErrorMessage from "@/components/ui/ErrorMessage";
import { Input, Label } from "@/components/ui/form";
import { FlexColumn } from "@/components/ui/layouts";
import { authResource } from "@/features/auth/services";
import useDebouncedInput from "@/hooks/useDebouncedInput";

export default function StepOne() {
  const {
    register,
    watch,
    setValue,
    setError,
    formState: { errors },
  } = useFormContext();
  const email = watch("email");
  const { mutate: checkEmail } = authResource.useApiMutation({
    pathKey: "checkEmailExists",
    options: {
      onSuccess: (data: any) => {
        if (data?.exists) {
          setError("email", {
            type: "custom",
            message: "Email already exists",
          });
        } else {
          setError("email", {
            type: "custom",
            message: "",
          });
        }
      },
    },
  });

  const [inputValue, handleDebouncedChange, setInputValue] = useDebouncedInput({
    init: email,
    onChange: (e) => setValue("email", e.target.value),
    ms: 700,
  });

  useEffect(() => {
    setInputValue(email);
  }, [setInputValue, email]);
  useEffect(() => {
    if (email.includes("@") && email.includes(".")) {
      checkEmail({ email });
    }
  }, [email, checkEmail]);

  return (
    <>
      <FlexColumn className="gap-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          type="text"
          placeholder="Enter Your Name"
          {...register("name")}
        />
        <ErrorMessage message={errors.name?.message as string} />
      </FlexColumn>
      <FlexColumn className="gap-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Enter Email (e.g. bijay@example.com)"
          onChange={handleDebouncedChange}
          value={inputValue}
        />
        <ErrorMessage message={errors.email?.message as string} />
      </FlexColumn>
      <FlexColumn className="gap-2">
        <Label htmlFor="phone">Phone Number</Label>
        <Input
          id="phone"
          type="text"
          placeholder="Enter Phone Number"
          {...register("number")}
        />
        <ErrorMessage message={errors.number?.message as string} />
      </FlexColumn>
    </>
  );
}
