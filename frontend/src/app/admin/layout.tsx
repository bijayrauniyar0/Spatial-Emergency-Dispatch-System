"use client";

import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/primitives/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";
import { RequireRole } from "@/components/common/RequireRole";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <RequireRole role="admin">
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </RequireRole>
  );
}
