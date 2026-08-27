"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { VolumeByDay } from "../types";

interface VolumeChartProps {
  data: VolumeByDay[];
  isLoading: boolean;
}

export const VolumeChart: React.FC<VolumeChartProps> = ({ data, isLoading }) => {
  if (isLoading || !data || data.length === 0) {
    return (
      <div className="h-80 rounded-lg border bg-white p-6 flex items-center justify-center">
        <p className="text-gray-500">{isLoading ? "Loading..." : "No data available"}</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Incident Volume Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#3b82f6" name="Incidents" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
