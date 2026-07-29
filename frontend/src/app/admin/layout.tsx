"use client";

import { ReactNode } from "react";

import { SidebarInset, SidebarProvider } from "@/components/primitives/sidebar";
import { AdminSidebar } from "@/features/admin/components/AdminSidebar";

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
