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

export const ResponderPerformanceTable: React.FC<
  ResponderPerformanceTableProps
> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Responder Performance</h3>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-muted h-12 animate-pulse rounded" />
          ))}
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Responder Performance</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <h3 className="mb-4 px-6 pt-6 text-lg font-semibold">
        Responder Performance
      </h3>
      <div className="max-h-100 overflow-x-auto overflow-y-auto px-6 pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left font-semibold">Responder</th>
              <th className="px-2 py-2 text-right font-semibold">Claimed</th>
              <th className="px-2 py-2 text-right font-semibold">Resolved</th>
              <th className="px-2 py-2 text-right font-semibold">
                Avg Resolution Time
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((responder) => (
              <tr
                key={responder.responder_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-2 py-3">{responder.responder_name}</td>
                <td className="px-2 py-3 text-right">{responder.claimed}</td>
                <td className="px-2 py-3 text-right">{responder.resolved}</td>
                <td className="px-2 py-3 text-right">
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
