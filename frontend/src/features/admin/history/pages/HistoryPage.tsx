"use client";

import { Container, FlexColumn, FlexRow } from "@/components/ui/layouts";
import { useIncidentHistory } from "../hooks/useIncidentHistory";
import { IncidentHistoryTable } from "../components/IncidentHistoryTable";

export const HistoryPage: React.FC = () => {
  const { incidents, total, page, isLoading, setFilters } = useIncidentHistory();

  const limit = 20;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (newPage: number) => {
    setFilters({ page: newPage });
  };

  return (
    <Container>
      <FlexColumn className="gap-4 py-4">
        <FlexRow className="items-center justify-between">
          <h2 className="text-2xl font-semibold">Incident History</h2>
          <FlexRow className="items-center gap-2">
            <span className="bg-muted rounded-full px-3 py-1 text-sm font-medium">
              {total} incident{total !== 1 ? "s" : ""}
            </span>
          </FlexRow>
        </FlexRow>

        <IncidentHistoryTable
          incidents={incidents}
          isLoading={isLoading}
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </FlexColumn>
    </Container>
  );
};
