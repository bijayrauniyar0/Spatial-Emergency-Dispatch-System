"use client";

import { Activity, AlertCircle, Clock, TrendingUp } from "lucide-react";
import { SummaryMetrics } from "../types";

interface SummaryCardsProps {
  metrics: SummaryMetrics | null;
  isLoading: boolean;
}

const formatSeconds = (seconds: number | null): string => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

export const SummaryCards: React.FC<SummaryCardsProps> = ({ metrics, isLoading }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!metrics) {
    return null;
  }

  const cards = [
    {
      label: "Total Incidents",
      value: metrics.total_incidents,
      icon: TrendingUp,
      color: "bg-blue-50 text-blue-600",
    },
    {
      label: "Active Incidents",
      value: metrics.active_incidents,
      icon: AlertCircle,
      color: "bg-red-50 text-red-600",
    },
    {
      label: "Avg Dispatch Time",
      value: formatSeconds(metrics.avg_dispatch_seconds),
      icon: Clock,
      color: "bg-yellow-50 text-yellow-600",
    },
    {
      label: "Avg Resolution Time",
      value: formatSeconds(metrics.avg_resolution_seconds),
      icon: Activity,
      color: "bg-green-50 text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div key={card.label} className="rounded-lg border bg-white p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{card.label}</p>
                <p className="text-2xl font-bold mt-2">{card.value}</p>
              </div>
              <div className={`rounded-lg p-3 ${card.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
