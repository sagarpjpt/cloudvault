"use client";

import { useState, useRef } from "react";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import ShareIcon from "@mui/icons-material/Share";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";
import { IconButton } from "@mui/material";

const iconMap = {
  download: DownloadIcon,
  preview: VisibilityIcon,
  rename: EditIcon,
  share: ShareIcon,
  delete: DeleteIcon,
  unstar: StarIcon,
  star: StarIcon,
};

export default function ActionMenu({ actions }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  const handleClick = (action) => {
    action.onClick();
    setIsOpen(false);
  };

  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <IconButton
        size="small"
        onClick={() => setIsOpen(!isOpen)}
        className="action-menu-trigger"
        sx={{
          color: "var(--color-primary)",
          "&:hover": { backgroundColor: "rgba(28, 77, 141, 0.08)" },
        }}
      >
        <MoreVertIcon fontSize="small" />
      </IconButton>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-[180px]"
          style={{ borderColor: "var(--color-border)" }}
          onClick={handleClickOutside}
        >
          {actions.map((action, index) => {
            const IconComponent = iconMap[action.iconName?.toLowerCase() || ""];

            return (
              <button
                key={index}
                onClick={() => handleClick(action)}
                className="w-full px-4 py-2.5 text-left text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-3 first:rounded-t-md last:rounded-b-md"
                style={{
                  color: action.color || "var(--color-text-main)",
                  borderBottom:
                    index < actions.length - 1
                      ? "1px solid var(--color-border)"
                      : "none",
                }}
              >
                {IconComponent && (
                  <IconComponent
                    fontSize="small"
                    sx={{ color: action.color || "var(--color-accent)" }}
                  />
                )}
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
