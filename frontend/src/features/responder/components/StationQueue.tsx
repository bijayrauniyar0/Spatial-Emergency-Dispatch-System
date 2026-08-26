"use client";

import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/primitives/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/primitives/table";
import { Button } from "@/components/ui/button";

import useDashboardStore from "../store/dashboardStore";
import useUIStore from "../store/uiStore";
import { StationQueueIncident } from "../types";

interface StationQueueProps {
  queue: StationQueueIncident[];
  isLoading?: boolean;
}

const categoryColors: Record<string, string> = {
  POLICE: "bg-blue-500",
  FIRE: "bg-red-500",
  MEDICAL: "bg-green-500",
};

export function StationQueue({ queue, isLoading }: StationQueueProps) {
  const { claim } = useDashboardStore();
  const { highlightedIncidentId } = useUIStore();
  const [claimingId, setClaimingId] = useState<string | null>(null);

  const handleClaim = async (incidentId: string) => {
    setClaimingId(incidentId);
    try {
      await claim(incidentId);
      toast.success("Incident claimed!");
    } catch (error: any) {
      const message =
        error?.response?.status === 409
          ? "This incident was already claimed"
          : error?.response?.data?.message || "Failed to claim incident";
      toast.error(message);
    } finally {
      setClaimingId(null);
    }
  };

  if (!queue || queue.length === 0) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-500">
          {isLoading ? "Loading..." : "No pending incidents"}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Category</TableHead>
            <TableHead>Time</TableHead>
            <TableHead className="w-24">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {queue.map((incident) => (
            <TableRow
              key={incident.id}
              className={
                highlightedIncidentId === incident.id
                  ? "bg-amber-50 ring-2 ring-amber-300"
                  : ""
              }
            >
              <TableCell>
                <Badge className={categoryColors[incident.category]}>
                  {incident.category}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">
                {new Date(incident.created_at).toLocaleString()}
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => handleClaim(incident.id)}
                  disabled={claimingId === incident.id}
                >
                  {claimingId === incident.id ? "..." : "Claim"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
