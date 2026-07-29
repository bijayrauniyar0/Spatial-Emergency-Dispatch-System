"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Flame, Heart, Shield } from "lucide-react";

import { Button } from "@/components/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/form";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

import { LocationPicker } from "./LocationPicker";
import { useIncidentStore } from "../store/incidentStore";
import {
  createIncidentSchema,
  CreateIncidentFormValues,
} from "../validations/incidentSchema";

interface EmergencyRequestFormProps {
  onSuccess?: () => void;
}

const CATEGORY_OPTIONS = [
  {
    value: "POLICE",
    label: "Police",
    icon: <Shield className="h-4 w-4" />,
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  },
  {
    value: "FIRE",
    label: "Fire",
    icon: <Flame className="h-4 w-4" />,
    color: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  },
  {
    value: "MEDICAL",
    label: "Medical",
    icon: <Heart className="h-4 w-4" />,
    color: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  },
];

export const EmergencyRequestForm: React.FC<EmergencyRequestFormProps> = ({
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { submitIncident, error } = useIncidentStore();

  const form = useForm<CreateIncidentFormValues>({
    resolver: zodResolver(createIncidentSchema),
    defaultValues: {
      category: "POLICE",
      latitude: 27.7172,
      longitude: 85.324,
    },
  });

  const onSubmit = async (values: CreateIncidentFormValues) => {
    setIsSubmitting(true);
    try {
      await submitIncident({
        category: values.category,
        latitude: values.latitude,
        longitude: values.longitude,
      });
      onSuccess?.();
    } catch (err) {
      console.error("Failed to submit emergency request:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategory = form.watch("category");

  return (
    <FlexColumn className="w-full gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-2xl font-bold">Emergency Request</h2>
        <p className="text-muted-foreground text-sm">
          Select the emergency type and your location. We'll connect you with the
          nearest responder.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-h-[70vh] overflow-y-auto">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Emergency Type</FormLabel>
                <FormControl>
                  <FlexRow className="gap-2">
                    {CATEGORY_OPTIONS.map((option) => (
                      <Button
                        key={option.value}
                        type="button"
                        variant={
                          selectedCategory === option.value
                            ? "default"
                            : "outline"
                        }
                        className="flex-1"
                        onClick={() => field.onChange(option.value)}
                      >
                        {option.icon}
                        <span className="ml-2">{option.label}</span>
                      </Button>
                    ))}
                  </FlexRow>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Your Location</FormLabel>
                <FormControl>
                  <LocationPicker
                    initialLat={field.value}
                    initialLng={form.getValues("longitude")}
                    onLocationSelect={(lat, lng) => {
                      field.onChange(lat);
                      form.setValue("longitude", lng);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FlexRow className="justify-end gap-3">
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Sending..." : "Send Emergency Request"}
            </Button>
          </FlexRow>
        </form>
      </Form>
    </FlexColumn>
  );
};
