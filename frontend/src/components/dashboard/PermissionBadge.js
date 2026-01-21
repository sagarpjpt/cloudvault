"use client";

import { Chip } from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";
import EditIcon from "@mui/icons-material/Edit";

const PermissionBadge = ({ role, isOwner = false }) => {
  if (isOwner) {
    return (
      <Chip
        icon={<EditIcon />}
        label="Owner"
        size="small"
        color="success"
        variant="filled"
      />
    );
  }

  if (role === "EDITOR") {
    return (
      <Chip
        icon={<EditIcon />}
        label="Editor"
        size="small"
        color="primary"
        variant="filled"
      />
    );
  }

  if (role === "VIEWER") {
    return (
      <Chip
        icon={<LockIcon />}
        label="Viewer"
        size="small"
        color="info"
        variant="filled"
      />
    );
  }

  return null;
};

export default PermissionBadge;
