"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/primitives/form";
import { Input } from "@/components/primitives/input";
import Dropdown from "@/components/ui/dropdown";
import { FlexColumn, FlexRow } from "@/components/ui/layouts";

import { useAdminStore } from "../../store/adminStore";
import { useResponderStore } from "../store/responderStore";
import { Responder } from "../types";
import {
  CreateResponderFormValues,
  createResponderSchema,
  UpdateResponderFormValues,
  updateResponderSchema,
} from "../validations/responderSchema";

interface ResponderFormProps {
  mode: "create" | "edit";
  initialData?: Responder;
  onSuccess?: () => void;
}

export const ResponderForm: React.FC<ResponderFormProps> = ({
  mode,
  initialData,
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addResponder, editResponder, error } = useResponderStore();
  const { stations, fetchStations } = useAdminStore();

  const schema =
    mode === "create" ? createResponderSchema : updateResponderSchema;

  const form = useForm<CreateResponderFormValues | UpdateResponderFormValues>({
    resolver: zodResolver(schema),
    defaultValues:
      mode === "create"
        ? {
            name: "",
            email: "",
            password: "",
            number: "",
            station_id: undefined,
          }
        : {
            station_id: initialData?.station_id,
            status: initialData?.status,
          },
  });

  useEffect(() => {
    if (stations.length === 0) {
      fetchStations();
    }
  }, []);

  const onSubmit = async (
    values: CreateResponderFormValues | UpdateResponderFormValues,
  ) => {
    setIsSubmitting(true);
    try {
      if (mode === "create") {
        const createData = values as CreateResponderFormValues;
        await addResponder({
          name: createData.name,
          email: createData.email,
          password: createData.password,
          number: createData.number || undefined,
          station_id: createData.station_id,
        });
      } else {
        const updateData = values as UpdateResponderFormValues;
        if (initialData) {
          await editResponder(initialData.id, {
            station_id: updateData.station_id,
            status: updateData.status,
          });
        }
      }
      form.reset();
      onSuccess?.();
    } catch (err) {
      console.error(`Failed to ${mode} responder:`, err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const stationOptions = stations.map((station) => ({
    value: station.id.toString(),
    label: `${station.name} (${station.category})`,
  }));

  const statusOptions = [
    { value: "AVAILABLE", label: "Available" },
    { value: "BUSY", label: "Busy" },
    { value: "OFF_DUTY", label: "Off Duty" },
  ];

  return (
    <FlexColumn className="max-h-[80vh] w-full gap-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">
          {mode === "create" ? "Add New Responder" : "Edit Responder"}
        </h2>
        <p className="text-muted-foreground text-sm">
          {mode === "create"
            ? "Create a new responder account for a station."
            : "Update responder details."}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          {mode === "create" && (
            <>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="e.g., john@example.com"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter a strong password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="e.g., 9841234567"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          {mode === "create" && (
            <FormField
              control={form.control}
              name="station_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Station</FormLabel>
                  <FormControl>
                    <Dropdown
                      label=""
                      placeholder="Select a station"
                      value={field.value?.toString() || ""}
                      options={stationOptions}
                      onValueChange={(value) =>
                        field.onChange(parseInt(value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          {mode === "edit" && (
            <>
              <FormField
                control={form.control}
                name="station_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Station</FormLabel>
                    <FormControl>
                      <Dropdown
                        label=""
                        placeholder="Select a station"
                        value={field.value?.toString() || ""}
                        options={stationOptions}
                        onValueChange={(value) =>
                          field.onChange(parseInt(value, 10))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <FormControl>
                      <Dropdown
                        label=""
                        placeholder="Select status"
                        value={field.value || ""}
                        options={statusOptions}
                        onValueChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}

          <FlexRow className="justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              disabled={isSubmitting}
            >
              Reset
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting
                ? mode === "create"
                  ? "Creating..."
                  : "Saving..."
                : mode === "create"
                  ? "Create Responder"
                  : "Save Changes"}
            </Button>
          </FlexRow>
        </form>
      </Form>
    </FlexColumn>
  );
};
