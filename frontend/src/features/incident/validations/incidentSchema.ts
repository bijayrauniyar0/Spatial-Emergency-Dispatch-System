import { z } from "zod";

export const createIncidentSchema = z.object({
  category: z.enum(["POLICE", "FIRE", "MEDICAL"]),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

export type CreateIncidentFormValues = z.infer<typeof createIncidentSchema>;
