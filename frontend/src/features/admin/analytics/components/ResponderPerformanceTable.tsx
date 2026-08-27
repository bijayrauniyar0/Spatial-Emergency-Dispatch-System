"use client";

import { ResponderMetrics } from "../types";

interface ResponderPerformanceTableProps {
  data: ResponderMetrics[];
  isLoading: boolean;
}

const formatSeconds = (seconds: number | null): string => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const ResponderPerformanceTable: React.FC<ResponderPerformanceTableProps> = ({
  data,
  isLoading,
}) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Responder Performance</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 bg-muted animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="text-lg font-semibold mb-4">Responder Performance</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Responder Performance</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2 px-2 font-semibold">Responder</th>
              <th className="text-right py-2 px-2 font-semibold">Claimed</th>
              <th className="text-right py-2 px-2 font-semibold">Resolved</th>
              <th className="text-right py-2 px-2 font-semibold">Avg Resolution Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((responder) => (
              <tr key={responder.responder_id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-2">{responder.responder_name}</td>
                <td className="text-right py-3 px-2">{responder.claimed}</td>
                <td className="text-right py-3 px-2">{responder.resolved}</td>
                <td className="text-right py-3 px-2">
                  {formatSeconds(responder.avg_resolution_seconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
