"use client";

import { Container, FlexColumn } from "@/components/ui/layouts";
import { useAnalytics } from "../hooks/useAnalytics";
import { SummaryCards } from "../components/SummaryCards";
import { VolumeChart } from "../components/VolumeChart";
import { CategoryChart } from "../components/CategoryChart";
import { StationPerformanceTable } from "../components/StationPerformanceTable";
import { ResponderPerformanceTable } from "../components/ResponderPerformanceTable";

export const AnalyticsPage: React.FC = () => {
  const { data, isLoading } = useAnalytics();

  return (
    <Container>
      <FlexColumn className="gap-6 py-4">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">Last 30 days overview</p>
        </div>

        <SummaryCards metrics={data?.summary || null} isLoading={isLoading} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <VolumeChart data={data?.volumeByDay || []} isLoading={isLoading} />
          <CategoryChart data={data?.byCategory || []} isLoading={isLoading} />
        </div>

        <StationPerformanceTable data={data?.byStation || []} isLoading={isLoading} />
        <ResponderPerformanceTable data={data?.byResponder || []} isLoading={isLoading} />
      </FlexColumn>
    </Container>
  );
};
