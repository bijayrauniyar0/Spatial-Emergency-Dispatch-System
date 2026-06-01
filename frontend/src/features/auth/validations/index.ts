import { z } from "zod";

import { createPasswordValidation, emailSchema } from "../../../validations";

export const signupSchemaStepOne = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .regex(/^[a-zA-Z0-9\s]+$/, {
      message: "Only letters, numbers, and spaces are allowed",
    }),
  email: emailSchema,
  number: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.length === 10, {
      message: "Invalid Phone Number.",
    })
    .refine((value) => !value || /^[0-9]{10}$/.test(value), {
      message: "Invalid Phone Number",
    }),
});

export const passwordSchema = z.object({
  password: createPasswordValidation("Password"),
  confirmPassword: z
    .string()
    .min(6, "Confirm Password must be at least 6 characters long"),
});

export const signupValidation = z
  .object({
    name: z
      .string()
      .min(2, "Name must be at least 2 characters")
      .max(100, "Name must be less than 100 characters"),
    email: emailSchema,
    password: createPasswordValidation("Password"),
    confirmPassword: z
      .string()
      .min(8, "Confirm Password must be at least 8 characters long"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export const resetPasswordValidation = passwordSchema.refine(
  (data) => data.password === data.confirmPassword,
  {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  },
);

export const stepTwoValidation = passwordSchema
  // .extend({
  //   isTermsChecked: z.literal(true, {
  //     errorMap: () => ({ message: "You must accept the terms and conditions" }),
  //   }),
  // })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });
