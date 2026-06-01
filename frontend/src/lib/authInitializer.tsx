"use client";

import { useEffect } from "react";

import { userResource } from "@/features/user/services";
import useAuthStore from "@/store/auth";

export function AuthInitializer() {
  const { setUserProfile, setIsAuthenticated, clearUserProfile } =
    useAuthStore();
  const { data: userProfile, isError } = userResource.useApiQuery({
    pathKey: "profile",
    options: {
      retry: false,
    },
  });

  useEffect(() => {
    if (userProfile) {
      setUserProfile(userProfile);
      setIsAuthenticated(true);
    } else if (isError) {
      setIsAuthenticated(false);
      clearUserProfile();
    }
  }, [
    userProfile,
    isError,
    setUserProfile,
    setIsAuthenticated,
    clearUserProfile,
  ]);

  return null;
}
