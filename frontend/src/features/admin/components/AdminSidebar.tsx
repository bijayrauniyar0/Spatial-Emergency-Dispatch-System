"use client";

import { BarChart3, Home, Users, TrendingUp, History } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/primitives/sidebar";
import { cn } from "@/lib/utils";

const adminNavItems = [
  {
    label: "Stations",
    href: "/admin/",
    icon: BarChart3,
  },
  {
    label: "Responders",
    href: "/admin/responders/",
    icon: Users,
  },
  {
    label: "Analytics",
    href: "/admin/analytics/",
    icon: TrendingUp,
  },
  {
    label: "History",
    href: "/admin/history/",
    icon: History,
  },
];

export const AdminSidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <Sidebar>
      <SidebarHeader className="border-b px-4 py-4">
        <h2 className="text-lg font-bold">Admin Panel</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu className="gap-1 px-2 py-2">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  className={cn(
                    "hover:bg-primary hover:text-primary-foreground h-full! py-3!",
                    isActive ? "bg-primary text-white" : "",
                  )}
                >
                  <Link href={item.href} className="flex items-center gap-3">
                    <Icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/" className="flex items-center gap-3">
                <Home className="h-5 w-5" />
                <span>Go to Home</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};
