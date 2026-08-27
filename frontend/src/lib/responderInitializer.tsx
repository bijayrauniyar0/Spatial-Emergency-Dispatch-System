"use client";

import { useEffect, useRef } from "react";
import useAuthStore from "@/store/auth";
import useDashboardStore from "@/features/responder/store/dashboardStore";
import { useResponderStream } from "@/features/responder/hooks/useResponderStream";
import { useLocationBroadcaster } from "@/features/responder/hooks/useLocationBroadcaster";

export function ResponderInitializer() {
  const { userProfile, isAuthenticated, isAuthLoading } = useAuthStore();
  const { fetchAll, fetchProfile, fetchMyTask, profile } = useDashboardStore();
  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const visibilityListenerRef = useRef<(() => void) | null>(null);

  // Mount responder SSE stream and location broadcaster
  useResponderStream();
  useLocationBroadcaster();

  // Initial fetch: get profile on mount
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || userProfile?.role !== "responder") {
      return;
    }

    fetchProfile();
  }, [isAuthLoading, isAuthenticated, userProfile?.role, fetchProfile]);

  // Monitor profile changes and manage polling based on has_active_task
  useEffect(() => {
    if (isAuthLoading || !isAuthenticated || userProfile?.role !== "responder" || !profile) {
      return;
    }

    const hasActiveTask = profile.has_active_task ?? false;

    if (hasActiveTask) {
      // Stop polling if it was running
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
      // Remove visibility listener if it exists
      if (visibilityListenerRef.current) {
        document.removeEventListener("visibilitychange", visibilityListenerRef.current);
        visibilityListenerRef.current = null;
      }
      // Fetch the active task once
      fetchMyTask();
    } else {
      // Start polling only if not already polling
      if (!intervalIdRef.current) {
        fetchAll();
        intervalIdRef.current = setInterval(fetchAll, 5_000);

        // Add visibility listener
        const handleVisibilityChange = () => {
          if (document.hidden) {
            if (intervalIdRef.current) {
              clearInterval(intervalIdRef.current);
              intervalIdRef.current = null;
            }
          } else {
            fetchAll();
            intervalIdRef.current = setInterval(fetchAll, 5_000);
          }
        };

        visibilityListenerRef.current = handleVisibilityChange;
        document.addEventListener("visibilitychange", handleVisibilityChange);
      }
    }

    return () => {
      // Cleanup is handled by the next effect run, not here
    };
  }, [profile, isAuthLoading, isAuthenticated, userProfile?.role, fetchAll, fetchMyTask]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
      if (visibilityListenerRef.current) {
        document.removeEventListener("visibilitychange", visibilityListenerRef.current);
      }
    };
  }, []);

  return null;
}
