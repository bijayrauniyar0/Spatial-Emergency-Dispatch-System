"use client";

import { StationMetrics } from "../types";

interface StationPerformanceTableProps {
  data: StationMetrics[];
  isLoading: boolean;
}

const formatSeconds = (seconds: number | null): string => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const StationPerformanceTable: React.FC<
  StationPerformanceTableProps
> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold">Station Performance</h3>
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
        <h3 className="mb-4 text-lg font-semibold">Station Performance</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white">
      <h3 className="mb-4 px-6 pt-6 text-lg font-semibold">
        Station Performance
      </h3>
      <div className="max-h-100 overflow-x-auto overflow-y-auto px-6 pb-6">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-2 py-2 text-left font-semibold">Station</th>
              <th className="px-2 py-2 text-right font-semibold">Incidents</th>
              <th className="px-2 py-2 text-right font-semibold">
                Avg Resolution Time
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((station) => (
              <tr
                key={station.station_id}
                className="border-b hover:bg-gray-50"
              >
                <td className="px-2 py-3">{station.station_name}</td>
                <td className="px-2 py-3 text-right">{station.count}</td>
                <td className="px-2 py-3 text-right">
                  {formatSeconds(station.avg_resolution_seconds)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
