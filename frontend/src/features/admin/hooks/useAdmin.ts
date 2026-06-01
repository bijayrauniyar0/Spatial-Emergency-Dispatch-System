import { useAdminStore } from "../store/adminStore";
import { useEffect } from "react";

export const useAdmin = () => {
  const fetchStations = useAdminStore((state) => state.fetchStations);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return useAdminStore();
};
