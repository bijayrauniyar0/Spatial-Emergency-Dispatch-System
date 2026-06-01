import { create } from "zustand";
import { devtools } from "zustand/middleware";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface CommonStateData {}

interface CommonStateActions {
  setCommonState: (payload: Partial<CommonStateData>) => void;
}

type CommonState = CommonStateData & CommonStateActions;

const initialState: CommonStateActions = {
  setCommonState: () => {},
};

export const useCommonStore = create<CommonState>()(
  devtools(
    (set) => ({
      ...initialState,
      setCommonState: (payload: Partial<CommonState>) =>
        set((state) => ({ ...state, ...payload })),
    }),
    { name: "commonStore" },
  ),
);
