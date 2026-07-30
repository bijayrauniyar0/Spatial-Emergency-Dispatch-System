import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIState {
  isModalOpen: boolean;
  highlightedIncidentId: string | null;
  openModal: () => void;
  closeModal: () => void;
  setHighlightedIncident: (id: string | null) => void;
}

const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isModalOpen: false,
      highlightedIncidentId: null,
      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setHighlightedIncident: (id) => set({ highlightedIncidentId: id }),
    }),
    { name: "responderUIStore" },
  ),
);

export default useUIStore;
