import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UserProfile {
  email?: string;
  name?: string;
  [key: string]: any;
}

interface AuthStateData {
  userProfile: UserProfile | null;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
}

interface AuthStateActions {
  setUserProfile: (profile: UserProfile) => void;
  clearUserProfile: () => void;
  setIsAuthenticated: (isAuthenticated: boolean) => void;
  setIsAuthLoading: (isAuthLoading: boolean) => void;
}

type AuthState = AuthStateData & AuthStateActions;

const initialState: AuthStateData = {
  userProfile: null,
  isAuthenticated: false,
  isAuthLoading: true,
};

const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      ...initialState,
      setUserProfile: (profile: UserProfile) =>
        set((state) => ({ ...state, userProfile: profile })),
      clearUserProfile: () => set((state) => ({ ...state, userProfile: null })),
      setIsAuthenticated: (isAuthenticated: boolean) =>
        set((state) => ({ ...state, isAuthenticated })),
      setIsAuthLoading: (isAuthLoading: boolean) =>
        set((state) => ({ ...state, isAuthLoading })),
    }),
    { name: "authStore" },
  ),
);

export default useAuthStore;
