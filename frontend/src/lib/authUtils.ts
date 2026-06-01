import { api } from "@/lib/api-client/client";
import { UserProfile } from "@/features/user/services";
import useAuthStore from "@/store/auth";

export async function fetchAndSetUserProfile() {
  try {
    const response = await api.get<UserProfile>("/user/profile");
    const userData = response.data;

    useAuthStore.setState({
      userProfile: userData,
      isAuthenticated: true,
    });

    return userData;
  } catch (error) {
    useAuthStore.setState({
      isAuthenticated: false,
    });
    throw error;
  }
}

export function clearAuthStore() {
  useAuthStore.setState({
    isAuthenticated: false,
  });
}
