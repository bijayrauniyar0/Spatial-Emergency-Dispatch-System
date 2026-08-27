import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface LocationStoreState {
  myLocation: { lat: number; lng: number } | null;
  setMyLocation: (location: { lat: number; lng: number } | null) => void;
}

const useLocationStore = create<LocationStoreState>()(
  devtools(
    (set) => ({
      myLocation: null,
      setMyLocation: (location) => set({ myLocation: location }),
    }),
    { name: "locationStore" }
  )
);

export default useLocationStore;
