import { useEffect } from "react";
import { useIncidentStore } from "../store/incidentStore";

export const useActiveIncident = () => {
  const { activeIncident, isLoading, fetchActiveIncident } = useIncidentStore();

  useEffect(() => {
    // Fetch on mount and whenever store updates
    fetchActiveIncident();
  }, [fetchActiveIncident]);

  return {
    activeIncident,
    isLoading,
  };
};
