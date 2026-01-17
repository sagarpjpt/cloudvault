"use client";

import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

import { useStarred } from "@/hooks/useStarred";
import { starResource, unstarResource } from "@/services/star.api";

import Link from "next/link";
import { useFolders } from "@/hooks/useFolders";
import { useFiles } from "@/hooks/useFiles";

export default function DashboardPage() {
  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useFolders();
  const { files, loading: filesLoading, error: filesError } = useFiles();

  const { starred } = useStarred();

  const starredFileIds = new Set(
    starred
      .filter((item) => item.resource_type === "file")
      .map((item) => item.resource_id)
  );

  const toggleStar = async (fileId, isStarred) => {
    try {
      if (isStarred) {
        await unstarResource({
          resourceType: "file",
          resourceId: fileId,
        });
      } else {
        await starResource({
          resourceType: "file",
          resourceId: fileId,
        });
      }
    } catch (err) {
      console.error("Failed to toggle star");
    }
  };

  if (foldersLoading || filesLoading) {
    return <p>Loading...</p>;
  }

  if (foldersError || filesError) {
    return <p>Failed to load data</p>;
  }

  const rootFolders = folders.filter((folder) => folder.parent_id === null);

  const rootFiles = files.filter((file) => file.folder_id === null);

  return (
    <div>
      <h1 className="text-xl font-semibold mb-6">My Files</h1>

      {/* FOLDERS GRID */}
      <section className="mb-10">
        <h2 className="text-sm font-medium mb-3 text-gray-600">Folders</h2>

        {rootFolders.length === 0 ? (
          <p className="text-sm text-gray-500">No folders</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rootFolders.map((folder) => (
              <Link
                key={folder.id}
                href={`/dashboard/folder/${folder.id}`}
                className="border rounded p-4 bg-white hover:shadow"
              >
                <FolderIcon fontSize="large" />
                <p className="mt-2 font-medium">{folder.name}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* FILES TABLE */}
      <section>
        <h2 className="text-sm font-medium mb-3 text-gray-600">Files</h2>

        {rootFiles.length === 0 ? (
          <p className="text-sm text-gray-500">No files</p>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell />
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Modified</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {rootFiles.map((file) => (
                // <TableRow key={file.id}>
                //   <TableCell>
                //     <div className="flex items-center gap-2">
                //       <InsertDriveFileIcon fontSize="small" />
                //       {file.name}
                //     </div>
                //   </TableCell>
                //   <TableCell>{file.mime_type}</TableCell>
                //   <TableCell>
                //     {(Number(file.size) / 1024).toFixed(1)} KB
                //   </TableCell>
                //   <TableCell>
                //     {new Date(file.created_at).toLocaleDateString()}
                //   </TableCell>
                // </TableRow>
                <TableRow key={file.id}>
                  <TableCell width={40}>
                    <button
                      onClick={() =>
                        toggleStar(file.id, starredFileIds.has(file.id))
                      }
                    >
                      {starredFileIds.has(file.id) ? (
                        <StarIcon fontSize="small" />
                      ) : (
                        <StarBorderIcon fontSize="small" />
                      )}
                    </button>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-2">
                      <InsertDriveFileIcon fontSize="small" />
                      {file.name}
                    </div>
                  </TableCell>

                  <TableCell>{file.mime_type}</TableCell>
                  <TableCell>
                    {(Number(file.size) / 1024).toFixed(1)} KB
                  </TableCell>
                  <TableCell>
                    {new Date(file.created_at).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
