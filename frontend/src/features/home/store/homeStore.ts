import { create } from "zustand";

export type StationCategory = "POLICE" | "FIRE" | "MEDICAL";

interface HomeStoreState {
  selectedCategories: StationCategory[];
  toggleCategory: (category: StationCategory) => void;
  selectAll: () => void;
  getCategoriesQueryParam: () => string;
}

export const useHomeStore = create<HomeStoreState>((set, get) => ({
  selectedCategories: ["POLICE", "FIRE", "MEDICAL"],
  toggleCategory: (category) =>
    set((state) => {
      const selected = state.selectedCategories.includes(category)
        ? state.selectedCategories.filter((c) => c !== category)
        : [...state.selectedCategories, category];
      return { selectedCategories: selected };
    }),
  selectAll: () => set({ selectedCategories: ["POLICE", "FIRE", "MEDICAL"] }),
  getCategoriesQueryParam: () => {
    const { selectedCategories } = get();
    return selectedCategories.length > 0
      ? selectedCategories.join(",")
      : "POLICE,FIRE,MEDICAL";
  },
}));
