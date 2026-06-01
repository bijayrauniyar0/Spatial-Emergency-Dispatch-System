import * as z from "zod";

export const userSchema = z
  .object({
    username: z.string().min(1, "Username is required"),
    email: z.string().email("Invalid email address"),
    first_name: z.string().min(1, "First name is required"),
    last_name: z.string().min(1, "Last name is required"),
    middle_name: z.string().nullable().optional(),
    middle_name_ne: z.string().nullable().optional(),
    gender: z.enum(["Male", "Female", "Other"]),
    phone: z.string().nullable().optional(),
    image: z.string().nullable().optional(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirm_password: z.string().min(6, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: "Passwords do not match",
  });

export type UserFormData = z.infer<typeof userSchema>;
