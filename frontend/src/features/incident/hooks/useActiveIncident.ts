import { useEffect } from "react";
import { useIncidentStore } from "../store/incidentStore";

export const useActiveIncident = () => {
  const { activeIncident, isLoading, fetchActiveIncident } = useIncidentStore();

  useEffect(() => {
    fetchActiveIncident();
  }, []);

  return {
    activeIncident,
    isLoading,
  };
};
