"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderSharedIcon from "@mui/icons-material/FolderShared";
import StarIcon from "@mui/icons-material/Star";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchBar from "./SearchBar";
import SearchResults from "./SearchResults";
import { useSearch } from "@/hooks/useSearch";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const { results, loading, searchQuery, performSearch, clearSearch } =
    useSearch();

  const isActive = (path) =>
    pathname === path || pathname.startsWith(path + "/");

  const handleSearch = (query) => {
    performSearch(query);
    if (query.trim().length > 0) {
      setSearchOpen(true);
    }
  };

  const handleSearchClear = () => {
    clearSearch();
    setSearchOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    router.push("/login");
  };

  const navItems = [
    {
      href: "/dashboard",
      label: "My Files",
      icon: InsertDriveFileIcon,
      exact: true,
    },
    {
      href: "/dashboard/shared",
      label: "Shared with Me",
      icon: FolderSharedIcon,
    },
    { href: "/dashboard/starred", label: "Starred", icon: StarIcon },
    { href: "/trash", label: "Trash", icon: DeleteIcon },
  ];

  return (
    <aside
      className="w-64 h-screen p-4 flex flex-col overflow-y-auto"
      style={{
        backgroundColor: "var(--color-primary)",
        color: "white",
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/"
          className="inline-flex items-center justify-center p-2 rounded hover:bg-opacity-80 transition-all"
          style={{
            backgroundColor: "var(--color-primary-hover)",
          }}
          title="Go back to home"
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
        </Link>
        <h1 className="text-xl font-bold">CloudVault</h1>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          onSearch={handleSearch}
          onClear={handleSearchClear}
          placeholder="Search files..."
        />
      </div>

      {/* Search Results Dialog */}
      <SearchResults
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        results={results}
        loading={loading}
        searchQuery={searchQuery}
      />

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded font-medium transition-all"
              style={{
                backgroundColor: isActive(item.href)
                  ? "var(--color-primary-hover)"
                  : "transparent",
                opacity: isActive(item.href) ? 1 : 0.8,
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full px-3 py-2.5 rounded font-medium transition-all mt-4 flex items-center gap-3 opacity-80 hover:opacity-100"
        style={{
          backgroundColor: "var(--color-primary-hover)",
        }}
        title="Logout"
      >
        <LogoutIcon sx={{ fontSize: 20 }} />
        <span>Logout</span>
      </button>
    </aside>
  );
}
