"use client";

import { Box, Typography, LinearProgress, Card } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import { useStorageUsage } from "@/hooks/useStorageUsage";

export default function StorageUsage() {
  const { storage, loading } = useStorageUsage();

  if (loading || !storage) {
    return null;
  }

  const isNearLimit = storage.percentage > 80;
  const isAtLimit = storage.percentage >= 100;

  return (
    <Card
      sx={{
        p: 3,
        mb: 6,
        backgroundColor: isAtLimit
          ? "#fff3e0"
          : isNearLimit
            ? "#fff8e1"
            : "background.paper",
        borderLeft: isAtLimit
          ? "4px solid #d32f2f"
          : isNearLimit
            ? "4px solid #ff9800"
            : `4px solid var(--color-primary)`,
        borderRadius: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            mb: 1.5,
            gap: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StorageIcon
              sx={{
                color: "var(--color-primary)",
                fontSize: { xs: "20px", sm: "24px" },
              }}
            />
            <Typography
              variant="subtitle1"
              sx={{
                fontWeight: 600,
                fontSize: { xs: "14px", sm: "16px" },
                color: "var(--color-primary)",
              }}
            >
              Storage Usage
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              fontWeight: 500,
              fontSize: { xs: "12px", sm: "14px" },
              color: "var(--color-text-muted)",
            }}
          >
            {storage.usedGB} GB / {storage.totalGB} GB
          </Typography>
        </Box>

        <LinearProgress
          variant="determinate"
          value={storage.percentage}
          sx={{
            height: 8,
            borderRadius: 4,
            backgroundColor: "rgba(28, 77, 141, 0.1)",
            "& .MuiLinearProgress-bar": {
              backgroundColor: isAtLimit
                ? "#d32f2f"
                : isNearLimit
                  ? "#ff9800"
                  : "var(--color-primary)",
              borderRadius: 4,
            },
          }}
        />
      </Box>

      <Typography
        variant="caption"
        sx={{
          color: "var(--color-text-muted)",
          fontSize: { xs: "11px", sm: "12px" },
          display: "block",
        }}
      >
        {storage.percentage.toFixed(1)}% used
        {isAtLimit && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#d32f2f",
              fontWeight: 600,
              mt: 1,
              fontSize: { xs: "11px", sm: "12px" },
            }}
          >
            ⚠️ Storage limit reached. You cannot upload new files.
          </Typography>
        )}
        {isNearLimit && !isAtLimit && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "#ff9800",
              fontWeight: 600,
              mt: 1,
              fontSize: { xs: "11px", sm: "12px" },
            }}
          >
            ⚠️ Storage running low. Please delete some files.
          </Typography>
        )}
        {!isNearLimit && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "var(--color-text-muted)",
              mt: 1,
              fontSize: { xs: "11px", sm: "12px" },
            }}
          >
            {(
              (storage.totalBytes - storage.usedBytes) /
              (1024 * 1024 * 1024)
            ).toFixed(2)}{" "}
            GB remaining
          </Typography>
        )}
      </Typography>
    </Card>
  );
}
