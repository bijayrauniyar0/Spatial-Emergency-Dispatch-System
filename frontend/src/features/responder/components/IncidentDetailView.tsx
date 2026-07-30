"use client";

import { FlexColumn } from "@/components/ui/layouts";

import { StationQueueIncident } from "../types";

interface IncidentDetailViewProps {
  incident: StationQueueIncident;
}

export function IncidentDetailView({ incident }: IncidentDetailViewProps) {
  const citizen = (incident as any).citizen;
  const hasContactInfo =
    citizen && citizen.oauth_provider !== "guest" && citizen.number;
  const lat = incident.location.coordinates[1].toFixed(4);
  const lon = incident.location.coordinates[0].toFixed(4);
  const reportedTime = new Date(incident.created_at).toLocaleString();

  return (
    <FlexColumn className="gap-3 text-sm">
      {/* Citizen Information */}
      {citizen ? (
        <div className="space-y-2">
          <div>
            <p className="text-gray-600">Name</p>
            <p className="font-semibold">{citizen.name || "Unknown"}</p>
          </div>

          {hasContactInfo && (
            <div>
              <p className="text-gray-600">Phone</p>
              <p className="font-semibold">{citizen.number}</p>
            </div>
          )}

          {citizen.oauth_provider === "guest" && (
            <div className="rounded bg-yellow-100 p-2 text-yellow-800">
              Guest user — no contact information
            </div>
          )}
        </div>
      ) : (
        <p className="text-gray-500">Unable to load citizen information</p>
      )}

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
    </FlexColumn>
  );
}
