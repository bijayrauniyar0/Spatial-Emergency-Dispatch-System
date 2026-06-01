import { z } from "zod";

export const emailSchema = z
  .string()
  .email("Invalid email address")
  .min(1, "Email is required");

export const createPasswordValidation = (fieldName: string) => {
  return z
    .string()
    .min(8, `${fieldName} must be at least 8 characters long`)
    .regex(/[A-Z]/, `${fieldName} must contain at least one uppercase letter`)
    .regex(/[a-z]/, `${fieldName} must contain at least one lowercase letter`)
    .regex(/[0-9]/, `${fieldName} must contain at least one number`)
    .regex(
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
      `${fieldName} must contain at least one special character`,
    );
};
