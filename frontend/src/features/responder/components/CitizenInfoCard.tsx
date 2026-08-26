"use client";

import { FlexColumn } from "@/components/ui/layouts";

interface Citizen {
  id?: string;
  name?: string;
  number?: string;
  oauth_provider?: string;
}

interface CitizenInfoCardProps {
  citizen: Citizen | null | undefined;
}

export function CitizenInfoCard({ citizen }: CitizenInfoCardProps) {
  const hasContactInfo =
    citizen && citizen.oauth_provider !== "guest" && citizen.number;

  return (
    <FlexColumn className="gap-3 text-sm">
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
    </FlexColumn>
  );
}
