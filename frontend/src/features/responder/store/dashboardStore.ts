import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { responderDashboardClient } from "../api/client";
import {
  DashboardStoreState,
  MyResponderProfile,
  StationQueueIncident,
} from "../types";

interface DashboardStoreActions {
  setProfile: (profile: MyResponderProfile | null) => void;
  setQueue: (queue: StationQueueIncident[]) => void;
  setMyTask: (task: StationQueueIncident | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchAll: () => Promise<void>;
  fetchProfile: () => Promise<void>;
  fetchMyTask: () => Promise<void>;
  claim: (incidentId: string) => Promise<void>;
  arrive: (incidentId: string) => Promise<void>;
  resolve: (incidentId: string) => Promise<void>;
}

type DashboardStore = DashboardStoreState & DashboardStoreActions;

const initialState: DashboardStoreState = {
  profile: null,
  queue: [],
  myTask: null,
  isLoading: false,
  error: null,
};

const useDashboardStore = create<DashboardStore>()(
  devtools(
    (set) => ({
      ...initialState,
      setProfile: (profile) => set({ profile }),
      setQueue: (queue) => set({ queue }),
      setMyTask: (myTask) => set({ myTask }),
      setIsLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),

      fetchAll: async () => {
        set({ isLoading: true, error: null });
        try {
          // Only poll queue (what actually changes from external events)
          const queue = await responderDashboardClient.getStationQueue();
          set({ queue, isLoading: false });
        } catch (error: any) {
          set({
            error: error?.message || "Failed to fetch queue",
            isLoading: false,
          });
        }
      },

      fetchProfile: async () => {
        try {
          const profile = await responderDashboardClient.getMyProfile();
          set({ profile });
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch profile" });
        }
      },

      fetchMyTask: async () => {
        try {
          const myTask = await responderDashboardClient.getMyTask();
          set({ myTask });
        } catch (error: any) {
          set({ error: error?.message || "Failed to fetch task" });
        }
      },

      claim: async (incidentId: string) => {
        try {
          const claimedIncident = await responderDashboardClient.claimIncident(incidentId);
          set({ error: null });
          // Update optimistically: remove from queue, set as myTask
          set((state) => ({
            queue: state.queue.filter((i) => i.id !== incidentId),
            myTask: claimedIncident,
          }));
          // Refetch profile to update has_active_task (stops polling in responderInitializer)
          const profile = await responderDashboardClient.getMyProfile();
          set({ profile });
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to claim incident";
          set({ error: errorMsg });
          throw error;
        }
      },

      arrive: async (incidentId: string) => {
        try {
          const arrivedIncident = await responderDashboardClient.arriveIncident(incidentId);
          set({ error: null });
          // Update myTask with new status
          set({ myTask: arrivedIncident });
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to mark incident as arrived";
          set({ error: errorMsg });
          throw error;
        }
      },

      resolve: async (incidentId: string) => {
        try {
          await responderDashboardClient.resolveIncident(incidentId);
          set({ error: null });
          // Clear current task
          set({ myTask: null });
          // Refetch profile to update has_active_task (resumes polling in responderInitializer)
          const profile = await responderDashboardClient.getMyProfile();
          set({ profile });
        } catch (error: any) {
          const errorMsg =
            error?.response?.data?.message ||
            error?.message ||
            "Failed to mark incident as resolved";
          set({ error: errorMsg });
          throw error;
        }
      },
    }),
    { name: "dashboardStore" },
  ),
);

export default useDashboardStore;
