import { useEffect } from "react";

import { useAdminStore } from "../store/adminStore";

export const useAdmin = () => {
  const fetchStations = useAdminStore((state) => state.fetchStations);

  useEffect(() => {
    fetchStations();
  }, [fetchStations]);

  return useAdminStore();
};
