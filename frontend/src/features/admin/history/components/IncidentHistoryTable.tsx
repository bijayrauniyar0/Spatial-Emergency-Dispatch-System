"use client";

import { Badge } from "@/components/primitives/badge";
import { Button } from "@/components/primitives/button";

import { IncidentHistoryItem } from "../types";

interface IncidentHistoryTableProps {
  incidents: IncidentHistoryItem[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const statusColors: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  RESPONDING: "bg-blue-100 text-blue-800",
  ARRIVED: "bg-purple-100 text-purple-800",
  RESOLVED: "bg-green-100 text-green-800",
};

const categoryColors: Record<string, string> = {
  POLICE: "bg-red-100 text-red-800",
  FIRE: "bg-orange-100 text-orange-800",
  MEDICAL: "bg-cyan-100 text-cyan-800",
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleString();
};

export const IncidentHistoryTable: React.FC<IncidentHistoryTableProps> = ({
  incidents,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-muted h-12 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!incidents || incidents.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6 text-center">
        <p className="text-gray-500">No incidents found</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border bg-white">
      <div className="max-h-[calc(100dvh-14rem)] overflow-x-auto overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">ID</th>
              <th className="px-4 py-3 text-left font-semibold">Category</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Station</th>
              <th className="px-4 py-3 text-left font-semibold">Responder</th>
              <th className="px-4 py-3 text-left font-semibold">Created</th>
            </tr>
          </thead>
          <tbody>
            {incidents.map((incident) => (
              <tr key={incident.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">#{incident.id}</td>
                <td className="px-4 py-3">
                  <Badge className={categoryColors[incident.category]}>
                    {incident.category}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={statusColors[incident.status]}>
                    {incident.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">{incident.station?.name || "N/A"}</td>
                <td className="px-4 py-3">
                  {incident.responder?.user?.email || "Unclaimed"}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {formatDate(incident.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t bg-gray-50 px-4 py-3">
        <p className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
