"use client";

import { FlexColumn } from "@/components/ui/layouts";

import { CategoryChart } from "../components/CategoryChart";
import { ResponderPerformanceTable } from "../components/ResponderPerformanceTable";
import { StationPerformanceTable } from "../components/StationPerformanceTable";
import { SummaryCards } from "../components/SummaryCards";
import { VolumeChart } from "../components/VolumeChart";
import { useAnalytics } from "../hooks/useAnalytics";

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useAnalytics();

  return (
    <FlexColumn className="max-h-[calc(100dvh-4.5rem)] gap-4 overflow-y-auto px-6 py-4">
      <div>
        <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
        <p className="mt-1 text-gray-600">Last 30 days overview</p>
      </div>

      <FlexColumn className="gap-4">
        <SummaryCards metrics={data?.summary || null} isLoading={isLoading} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <VolumeChart data={data?.volumeByDay || []} isLoading={isLoading} />
          <CategoryChart data={data?.byCategory || []} isLoading={isLoading} />
        </div>

        <StationPerformanceTable
          data={data?.byStation || []}
          isLoading={isLoading}
        />
        <ResponderPerformanceTable
          data={data?.byResponder || []}
          isLoading={isLoading}
        />
      </FlexColumn>
    </FlexColumn>
  );
};
