"use client";
import { useFormContext } from "react-hook-form";

import ErrorMessage from "@/components/ui/ErrorMessage";
import { Checkbox, Label } from "@/components/ui/form";
import PasswordInput from "@/components/ui/form/password-input";
import { FlexColumn } from "@/components/ui/layouts";

export default function StepTwo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <FlexColumn className="relative mb-3">
        <Label className="mb-1 text-xs">Password</Label>
        <PasswordInput
          id="password"
          className="w-[4/5] pr-10"
          placeholder="Enter Password"
          {...register("password")}
        />

        {errors?.password?.message && (
          <ErrorMessage message={errors.password?.message as string} />
        )}
      </FlexColumn>
      <FlexColumn className="relative mb-3">
        <Label className="mb-1 text-xs">Confirm Password</Label>
        <PasswordInput
          id="confirm-password"
          className="w-[4/5] pr-10"
          placeholder="Enter Password"
          {...register("confirmPassword")}
        />

        <ErrorMessage message={errors.confirmPassword?.message as string} />
      </FlexColumn>
      <button className="mb-8 flex items-center gap-2" type="button">
        <Checkbox {...register("isTermsChecked")} />
        <Label className="mb-1 text-xs">
          I agree to the terms and conditions
        </Label>
      </button>
    </>
  );
}
