"use client";

import { useState } from "react";
import { toast } from "sonner";

import { FlexColumn } from "@/components/ui/layouts";
import { Button } from "@/components/ui/button";

import useDashboardStore from "../store/dashboardStore";
import { CitizenInfoCard } from "./CitizenInfoCard";
import { StationQueueIncident } from "../types";

interface IncidentDetailViewProps {
  incident: StationQueueIncident;
}

export function IncidentDetailView({ incident }: IncidentDetailViewProps) {
  const { arrive, resolve } = useDashboardStore();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const citizen = (incident as any).citizen;
  const lat = incident.location.coordinates[1].toFixed(4);
  const lon = incident.location.coordinates[0].toFixed(4);
  const reportedTime = new Date(incident.created_at).toLocaleString();

  const handleArrive = async () => {
    setIsSubmitting(true);
    try {
      await arrive(incident.id);
      toast.success("Incident marked as arrived");
    } catch (error) {
      toast.error("Failed to mark incident as arrived");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResolve = async () => {
    setIsSubmitting(true);
    try {
      await resolve(incident.id);
      toast.success("Incident resolved");
    } catch (error) {
      toast.error("Failed to resolve incident");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FlexColumn className="gap-4 text-sm">
      {/* Citizen Information */}
      <CitizenInfoCard citizen={citizen} />

      {/* Location */}
      <div>
        <p className="text-gray-600">Location</p>
        <p className="font-mono text-xs">
          {lat}, {lon}
        </p>
      </div>

      {/* Reported Time */}
      <div>
        <p className="text-gray-600">Reported</p>
        <p>{reportedTime}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        {incident.status === "RESPONDING" && (
          <Button
            onClick={handleArrive}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "..." : "Mark Arrived"}
          </Button>
        )}
        {incident.status === "ARRIVED" && (
          <Button
            onClick={handleResolve}
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? "..." : "Mark Resolved"}
          </Button>
        )}
      </div>
    </FlexColumn>
  );
}
