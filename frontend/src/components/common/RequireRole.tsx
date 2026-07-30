"use client";

import { useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

import useAuthStore from "@/store/auth";

interface RequireRoleProps {
  role: "admin" | "responder";
  children: ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const router = useRouter();
  const { userProfile, isAuthenticated, isAuthLoading } = useAuthStore();

  useEffect(() => {
    if (!isAuthLoading && (!isAuthenticated || userProfile?.role !== role)) {
      router.push("/");
    }
  }, [isAuthLoading, isAuthenticated, userProfile, role, router]);

  if (isAuthLoading || !isAuthenticated || userProfile?.role !== role) {
    return null;
  }

  return children;
}
