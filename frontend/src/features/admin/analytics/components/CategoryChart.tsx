"use client";

import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { CategoryDistribution } from "../types";

interface CategoryChartProps {
  data: CategoryDistribution[];
  isLoading: boolean;
}

const COLORS = {
  POLICE: "#ef4444",
  FIRE: "#f97316",
  MEDICAL: "#06b6d4",
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="h-80 rounded-lg border bg-white p-6 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    console.warn("CategoryChart: No data provided", data);
    return (
      <div className="h-80 rounded-lg border bg-white p-6 flex items-center justify-center">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const chartData = data.map((item) => ({
    name: item.category,
    value: Number(item.count) || 0,
  }));

  console.log("CategoryChart data:", chartData);

  return (
    <div className="rounded-lg border bg-white p-6">
      <h3 className="text-lg font-semibold mb-4">Incidents by Category</h3>
      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[entry.name as keyof typeof COLORS] || "#888888"}
                />
              ))}
            </Pie>
            <Tooltip formatter={(value: any) => Number(value).toLocaleString()} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
