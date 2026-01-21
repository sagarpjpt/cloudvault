"use client";

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  CircularProgress,
  Alert,
  Paper,
} from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";
import Link from "next/link";

const SearchResults = ({ open, onClose, results, loading, searchQuery }) => {
  const { files = [], folders = [] } = results;
  const hasResults = files.length > 0 || folders.length > 0;

  if (!open) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: "absolute",
        top: "120px",
        left: "16px",
        width: "280px",
        maxHeight: "500px",
        overflowY: "auto",
        zIndex: 1000,
        backgroundColor: "white",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
    >
      <Box sx={{ p: 2, borderBottom: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Search Results
        </Typography>
        {searchQuery && (
          <Typography
            variant="caption"
            sx={{ color: "#666", display: "block", mt: 0.5 }}
          >{`for "${searchQuery}"`}</Typography>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}

        {!loading && !hasResults && (
          <Alert severity="info" sx={{ fontSize: "0.875rem" }}>
            No files or folders found
          </Alert>
        )}

        {!loading && hasResults && (
          <Box>
            {/* Folders */}
            {folders.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    display: "block",
                    mb: 0.5,
                    color: "#666",
                  }}
                >
                  Folders ({folders.length})
                </Typography>
                <List sx={{ width: "100%", p: 0 }}>
                  {folders.map((folder, index) => (
                    <ListItem
                      key={`folder-${folder.id}`}
                      disablePadding
                      sx={{ mb: 0.5 }}
                    >
                      <Link
                        href={`/dashboard/folder/${folder.id}`}
                        style={{ width: "100%" }}
                        onClick={onClose}
                      >
                        <ListItemButton sx={{ py: 0.5, px: 1 }}>
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            <FolderIcon
                              sx={{ color: "#ff9800", fontSize: 18 }}
                            />
                          </ListItemIcon>
                          <ListItemText
                            primary={folder.name}
                            primaryTypographyProps={{ variant: "body2" }}
                            secondary={new Date(
                              folder.created_at,
                            ).toLocaleDateString()}
                            secondaryTypographyProps={{ variant: "caption" }}
                          />
                        </ListItemButton>
                      </Link>
                    </ListItem>
                  ))}
                </List>
                {folders.length > 0 && files.length > 0 && (
                  <Divider sx={{ my: 1 }} />
                )}
              </Box>
            )}

            {/* Files */}
            {files.length > 0 && (
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    fontWeight: 600,
                    display: "block",
                    mb: 0.5,
                    color: "#666",
                  }}
                >
                  Files ({files.length})
                </Typography>
                <List sx={{ width: "100%", p: 0 }}>
                  {files.map((file, index) => (
                    <ListItem
                      key={`file-${file.id}`}
                      disablePadding
                      sx={{ mb: 0.5 }}
                    >
                      <ListItemButton sx={{ py: 0.5, px: 1 }} disabled>
                        <ListItemIcon sx={{ minWidth: 32 }}>
                          <InsertDriveFileIcon sx={{ fontSize: 18 }} />
                        </ListItemIcon>
                        <ListItemText
                          primary={file.name}
                          primaryTypographyProps={{ variant: "body2" }}
                          secondary={`${(Number(file.size) / 1024).toFixed(1)} KB • ${new Date(
                            file.created_at,
                          ).toLocaleDateString()}`}
                          secondaryTypographyProps={{ variant: "caption" }}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Box>
            )}
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default SearchResults;
