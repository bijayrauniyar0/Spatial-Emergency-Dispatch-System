"use client";

import { useEffect } from "react";

import { userResource } from "@/features/user/services";
import useAuthStore from "@/store/auth";

export function AuthInitializer() {
  const { setUserProfile, setIsAuthenticated, clearUserProfile, setIsAuthLoading } =
    useAuthStore();
  const { data: userProfile, isError, isLoading } = userResource.useApiQuery({
    pathKey: "profile",
    options: {
      retry: false,
    },
  });

  useEffect(() => {
    if (!isLoading) {
      setIsAuthLoading(false);
      if (userProfile) {
        setUserProfile(userProfile);
        setIsAuthenticated(true);
      } else if (isError) {
        setIsAuthenticated(false);
        clearUserProfile();
      }
    }
  }, [
    userProfile,
    isError,
    isLoading,
    setUserProfile,
    setIsAuthenticated,
    clearUserProfile,
    setIsAuthLoading,
  ]);

  return null;
}
