import { useEffect } from 'react';
import { useAnalyticsStore } from '../store/analyticsStore';

export const useAnalytics = () => {
  const { data, isLoading, error, dateRange, fetchAnalytics } = useAnalyticsStore();

  useEffect(() => {
    fetchAnalytics(dateRange.from, dateRange.to);
  }, [dateRange.from, dateRange.to, fetchAnalytics]);

  return {
    data,
    isLoading,
    error,
    dateRange,
    fetchAnalytics,
  };
};
