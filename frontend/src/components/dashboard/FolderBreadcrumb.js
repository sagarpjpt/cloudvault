"use client";

import Link from "next/link";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function FolderBreadcrumb({ breadcrumbs }) {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      className="mb-6"
      sx={{
        fontSize: { xs: "12px", sm: "14px" },
        "& .MuiBreadcrumbs-ol": {
          flexWrap: "wrap",
        },
      }}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast) {
          return (
            <Typography
              key={crumb.id || "root"}
              sx={{
                fontWeight: 600,
                color: "var(--color-primary)",
                fontSize: { xs: "12px", sm: "14px" },
                wordBreak: "break-word",
              }}
            >
              {crumb.name}
            </Typography>
          );
        }

        return (
          <Link
            key={crumb.id || "root"}
            href={crumb.id ? `/dashboard/folder/${crumb.id}` : "/dashboard"}
            className="hover:underline transition-all"
            style={{
              color: "var(--color-primary)",
              fontSize: "inherit",
              wordBreak: "break-word",
            }}
          >
            {crumb.name}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
}
