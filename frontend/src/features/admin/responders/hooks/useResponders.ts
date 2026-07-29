import { useEffect } from "react";

import { useResponderStore } from "../store/responderStore";

export const useResponders = () => {
  const { responders, isLoading, fetchResponders } = useResponderStore();

  useEffect(() => {
    fetchResponders();
  }, []);

  return {
    responders,
    isLoading,
    fetchResponders,
  };
};
