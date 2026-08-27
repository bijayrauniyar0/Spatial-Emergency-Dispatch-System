"use client";

import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/primitives/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FlexRow } from "@/components/ui/layouts";
import useAuthStore from "@/store/auth";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const userProfile = useAuthStore((state) => state.userProfile);
  const clearUserProfile = useAuthStore((state) => state.clearUserProfile);
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const isHomePage = pathname === "/";

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/v1/auth/log-out", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        clearUserProfile();
        setIsAuthenticated(false);
        toast.success("Logged out successfully");
        router.push("/login");
      } else {
        toast.error("Failed to logout");
      }
    } catch (error) {
      toast.error("Logout failed");
      console.error("Logout error:", error);
    }
  };

  return (
    <nav
      className={`z-50 w-full ${
        isHomePage
          ? "absolute top-0 bg-transparent"
          : "border-b border-gray-200 bg-white"
      }`}
    >
      <div className="w-full px-4 py-2">
        <FlexRow className="items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary flex h-8 w-8 items-center justify-center rounded-lg text-sm font-bold text-white">
              SED
            </div>
            <span className="text-lg font-semibold text-gray-900">SEDS</span>
          </Link>

          {/* Right Section */}
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="bg-primary hover:bg-primary/90 flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white">
                  {userProfile?.name?.charAt(0)?.toUpperCase() || "U"}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold text-gray-900">
                    {userProfile?.name}
                  </p>
                  <p className="text-xs text-gray-500">{userProfile?.email}</p>
                </div>
                <DropdownMenuSeparator />
                {userProfile?.role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem asChild>
                  <Link href="/profile">My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button size="sm">Login</Button>
            </Link>
          )}
        </FlexRow>
      </div>
    </nav>
  );
}
