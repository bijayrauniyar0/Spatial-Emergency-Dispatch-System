"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/primitives/select";
import { FlexColumn, FlexRow, Grid } from "@/components/ui/layouts";

import { useAdminStore } from "../store/adminStore";
import { CreateStationInput, StationCategory } from "../types";
import { MapSelector } from "./MapSelector";

const formSchema = z.object({
  name: z.string().min(1, "Station name is required").max(255),
  category: z.string().min(1, "Category is required"),
  latitude: z
    .number()
    .min(-90, "Latitude must be between -90 and 90")
    .max(90, "Latitude must be between -90 and 90"),
  longitude: z
    .number()
    .min(-180, "Longitude must be between -180 and 180")
    .max(180, "Longitude must be between -180 and 180"),
});

type FormValues = z.infer<typeof formSchema>;

interface AddStationFormProps {
  onSuccess?: () => void;
}

export const AddStationForm: React.FC<AddStationFormProps> = ({
  onSuccess,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [territory, setTerritory] = useState<GeoJSON.Feature | null>(null);
  const addStation = useAdminStore((state) => state.addStation);
  const error = useAdminStore((state) => state.error);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "POLICE",
      latitude: 27.7172,
      longitude: 85.324,
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const zoneGeoJson =
        territory && territory.geometry.type === "Polygon"
          ? (territory.geometry as any)
          : {
              type: "Polygon",
              coordinates: [
                [
                  [values.longitude - 0.01, values.latitude - 0.01],
                  [values.longitude + 0.01, values.latitude - 0.01],
                  [values.longitude + 0.01, values.latitude + 0.01],
                  [values.longitude - 0.01, values.latitude + 0.01],
                  [values.longitude - 0.01, values.latitude - 0.01],
                ],
              ],
            };

      const stationData: CreateStationInput = {
        name: values.name,
        category: values.category as StationCategory,
        latitude: values.latitude,
        longitude: values.longitude,
        zoneGeoJson,
      };

      await addStation(stationData);
      form.reset({
        name: "",
        category: "POLICE",
        latitude: 27.7172,
        longitude: 85.324,
      });
      setTerritory(null);
      onSuccess?.();
    } catch (err) {
      console.error("Failed to create station:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLocationSelect = (latitude: number, longitude: number) => {
    form.setValue("latitude", latitude);
    form.setValue("longitude", longitude);
  };

  return (
    <FlexColumn className="max-h-[80vh] w-full gap-6 overflow-y-auto">
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-semibold">Add New Station</h2>
        <p className="text-muted-foreground text-sm">
          Enter station details and select location on the map.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive rounded-md p-3 text-sm">
              {error}
            </div>
          )}

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Station Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g., Central Police Station"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Grid className="grid-cols-[18rem_1fr] gap-4">
            <FlexColumn className="gap-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="POLICE">Police</SelectItem>
                        <SelectItem value="FIRE">Fire</SelectItem>
                        <SelectItem value="MEDICAL">Medical</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="e.g., 27.7172"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.000001"
                        placeholder="e.g., 85.3240"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">GeoJSON File</label>
                <input
                  type="file"
                  accept=".geojson,.json"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      try {
                        const geojson = JSON.parse(
                          event.target?.result as string,
                        );
                        if (
                          geojson.type === "Feature" &&
                          geojson.geometry.type === "Polygon"
                        ) {
                          setTerritory(geojson);
                        } else if (
                          geojson.type === "FeatureCollection" &&
                          geojson.features.length > 0
                        ) {
                          const polygonFeature = geojson.features.find(
                            (f: GeoJSON.Feature) =>
                              f.geometry.type === "Polygon",
                          );
                          if (polygonFeature) {
                            setTerritory(polygonFeature);
                          }
                        }
                      } catch (_error) {
                        console.error("Invalid GeoJSON file");
                      }
                    };
                    reader.readAsText(file);
                  }}
                  className="border-input flex w-full rounded-md border px-2.5 py-1.5 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium"
                />
              </div>
            </FlexColumn>

            <MapSelector
              onLocationSelect={handleLocationSelect}
              onZoneSelect={setTerritory}
              latitude={form.watch("latitude")}
              longitude={form.watch("longitude")}
              zone={territory || undefined}
            />
          </Grid>

          <FlexRow className="justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                form.reset({
                  name: "",
                  category: "POLICE",
                  latitude: 27.7172,
                  longitude: 85.324,
                })
              }
              disabled={isSubmitting}
            >
              Clear
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Station"}
            </Button>
          </FlexRow>
        </form>
      </Form>
    </FlexColumn>
  );
};
