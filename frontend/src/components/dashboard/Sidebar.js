"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  return (
    <aside
      className="w-64 p-4"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "white",
      }}
    >
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center p-2 rounded hover:bg-opacity-80 transition-all"
          style={{
            backgroundColor: "var(--color-primary-hover)",
          }}
          title="Go back"
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </Link>
        <h1 className="text-xl font-semibold">CloudVault</h1>
      </div>

      <nav className="space-y-2">
        <Link
          href="/dashboard"
          className={`block px-3 py-2 rounded ${
            isActive("/dashboard") ? "font-medium" : ""
          }`}
          style={{
            backgroundColor: isActive("/dashboard")
              ? "var(--color-primary-hover)"
              : "transparent",
          }}
        >
          My Files
        </Link>

        <Link
          href="/dashboard/shared"
          className="block px-3 py-2 rounded"
          style={{
            backgroundColor: isActive("/dashboard/shared")
              ? "var(--color-primary-hover)"
              : "transparent",
          }}
        >
          Shared with me
        </Link>

        <Link
          href="/dashboard/starred"
          className="block px-3 py-2 rounded"
          style={{
            backgroundColor: isActive("/dashboard/starred")
              ? "var(--color-primary-hover)"
              : "transparent",
          }}
        >
          Starred
        </Link>
      </nav>
    </aside>
  );
}
