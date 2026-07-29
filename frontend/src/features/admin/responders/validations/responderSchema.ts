import { z } from "zod";

import { createPasswordValidation, emailSchema } from "@/validations";

export const createResponderSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: emailSchema,
  password: createPasswordValidation("Password"),
  number: z
    .string()
    .nullable()
    .optional()
    .refine((value) => !value || value.length === 10, {
      message: "Phone number must be 10 digits",
    })
    .refine((value) => !value || /^[0-9]{10}$/.test(value), {
      message: "Phone number must contain only digits",
    }),
  station_id: z.number().min(1, "Station is required"),
});

export const updateResponderSchema = z
  .object({
    station_id: z.number().min(1, "Station is required").optional(),
    status: z
      .enum(["AVAILABLE", "BUSY", "OFF_DUTY"])
      .optional(),
  })
  .refine(
    (data) => data.station_id !== undefined || data.status !== undefined,
    {
      message: "At least one field (station or status) is required",
    },
  );

export type CreateResponderFormValues = z.infer<typeof createResponderSchema>;
export type UpdateResponderFormValues = z.infer<typeof updateResponderSchema>;
