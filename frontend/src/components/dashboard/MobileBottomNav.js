"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SharedIcon from "@mui/icons-material/FolderShared";
import StarIcon from "@mui/icons-material/Star";
import LogoutIcon from "@mui/icons-material/Logout";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const navItems = [
    { href: "/dashboard", label: "Files", icon: DashboardIcon },
    { href: "/dashboard/shared", label: "Shared", icon: SharedIcon },
    { href: "/dashboard/starred", label: "Starred", icon: StarIcon },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 md:hidden bg-white border-t flex justify-around items-center h-16"
      style={{
        borderColor: "var(--color-border)",
        backgroundColor: "var(--color-surface)",
      }}
    >
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
          style={{
            color: isActive(item.href)
              ? "var(--color-primary)"
              : "var(--color-text-muted)",
          }}
        >
          <item.icon fontSize="small" />
          <span className="text-xs font-medium">{item.label}</span>
        </Link>
      ))}

      <button
        onClick={handleLogout}
        className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors"
        style={{ color: "var(--color-text-muted)" }}
        title="Logout"
      >
        <LogoutIcon fontSize="small" />
        <span className="text-xs font-medium">Logout</span>
      </button>
    </nav>
  );
}
