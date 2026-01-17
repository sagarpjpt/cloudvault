"use client";

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import FolderIcon from "@mui/icons-material/Folder";

import { useStarred } from "@/hooks/useStarred";

export default function StarredPage() {
  const { starred, loading, error } = useStarred();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">
        Starred
      </h1>

      {starred.length === 0 ? (
        <p className="text-sm text-gray-500">
          No starred items
        </p>
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Starred On</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {starred.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {item.resource_type === "file" ? (
                      <InsertDriveFileIcon fontSize="small" />
                    ) : (
                      <FolderIcon fontSize="small" />
                    )}
                    {item.resource_id}
                  </div>
                </TableCell>
                <TableCell>{item.resource_type}</TableCell>
                <TableCell>
                  {new Date(item.created_at).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
