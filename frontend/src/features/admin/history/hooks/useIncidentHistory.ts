import { useEffect } from 'react';
import { useHistoryStore } from '../store/historyStore';

export const useIncidentHistory = () => {
  const { incidents, total, page, isLoading, error, filters, fetchIncidents, setFilters } =
    useHistoryStore();

  useEffect(() => {
    fetchIncidents(filters);
  }, [filters, fetchIncidents]);

  return {
    incidents,
    total,
    page,
    isLoading,
    error,
    filters,
    fetchIncidents,
    setFilters,
  };
};
