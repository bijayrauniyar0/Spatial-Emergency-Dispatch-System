"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { FlexColumn } from "@/components/ui/layouts";

import { Station } from "../types";

interface StationListProps {
  stations: Station[];
  isLoading?: boolean;
}

export const StationList: React.FC<StationListProps> = ({
  stations,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <FlexColumn className="w-full items-center justify-center py-8">
        <p className="text-muted-foreground">Loading stations...</p>
      </FlexColumn>
    );
  }

  if (stations.length === 0) {
    return (
      <FlexColumn className="w-full items-center justify-center py-8">
        <p className="text-muted-foreground">No stations found</p>
      </FlexColumn>
    );
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "POLICE":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "FIRE":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "MEDICAL":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
    }
  };

  return (
    <FlexColumn className="scrollbar h-[calc(100vh-14rem)] w-full gap-4 overflow-y-auto bg-white">
      <Table containerClassName="border rounded-lg">
        <TableHeader className="sticky top-0 bg-white">
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Latitude</TableHead>
            <TableHead>Longitude</TableHead>
            <TableHead>Created At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {stations.map((station) => (
            <TableRow key={station.id}>
              <TableCell className="py-4 font-medium">{station.name}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(
                    station.category,
                  )}`}
                >
                  {station.category}
                </span>
              </TableCell>
              <TableCell>{station.latitude.toFixed(6)}</TableCell>
              <TableCell>{station.longitude.toFixed(6)}</TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(station.created_at).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </FlexColumn>
  );
};
