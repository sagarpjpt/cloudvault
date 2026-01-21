"use client";

import Link from "next/link";
import FolderIcon from "@mui/icons-material/Folder";

export default function FolderCard({ folder, onContextMenu }) {
  return (
    <Link
      href={`/dashboard/folder/${folder.id}`}
      className="group relative bg-white border rounded-lg p-4 hover:shadow-md transition-all cursor-pointer h-full flex flex-col"
      style={{
        borderColor: "var(--color-border)",
      }}
    >
      <div className="flex-1 flex flex-col">
        <FolderIcon
          sx={{
            fontSize: 40,
            color: "var(--color-accent)",
            mb: 1,
          }}
        />
        <p className="font-medium text-sm break-words line-clamp-2 flex-1">
          {folder.name}
        </p>
      </div>
    </Link>
  );
}
