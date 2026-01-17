"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";

import { useFolders } from "@/hooks/useFolders";
import { useFiles } from "@/hooks/useFiles";
import { buildBreadcrumbs } from "@/utils/buildBreadcrumbs";
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

export default function FolderPage() {
  const { id } = useParams();
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

  const {
    folders,
    loading: foldersLoading,
    error: foldersError,
  } = useFolders();
  const { files, loading: filesLoading, error: filesError } = useFiles();

  if (foldersLoading || filesLoading) {
    return <p>Loading...</p>;
  }

  if (foldersError || filesError) {
    return <p>Failed to load folder data</p>;
  }

  const subFolders = folders.filter((folder) => folder.parent_id === id);

  const folderFiles = files.filter((file) => file.folder_id === id);

  const breadcrumbs = buildBreadcrumbs(folders, id);

  return (
    <div>
      {/* BREADCRUMBS */}
      <Breadcrumbs aria-label="breadcrumb" className="mb-6">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          if (isLast) {
            return (
              <Typography
                key={crumb.id || "root"}
                color="text.primary"
                fontSize="14px"
              >
                {crumb.name}
              </Typography>
            );
          }

          return (
            <Link
              key={crumb.id || "root"}
              href={crumb.id ? `/dashboard/folder/${crumb.id}` : "/dashboard"}
              className="text-sm text-blue-600 hover:underline"
            >
              {crumb.name}
            </Link>
          );
        })}
      </Breadcrumbs>

      {/* SUBFOLDERS */}
      <section className="my-8">
        <h2 className="text-sm font-medium mb-3 text-gray-600">Folders</h2>

        {subFolders.length === 0 ? (
          <p className="text-sm text-gray-500">No subfolders</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {subFolders.map((folder) => (
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

      {/* FILES */}
      <section>
        <h2 className="text-sm font-medium mb-3 text-gray-600">Files</h2>

        {folderFiles.length === 0 ? (
          <p className="text-sm text-gray-500">No files in this folder</p>
        ) : (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell width={40} />
                <TableCell>Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Modified</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {folderFiles.map((file) => {
                const isStarred = starredFileIds.has(file.id);

                return (
                  <TableRow key={file.id}>
                    <TableCell>
                      <button onClick={() => toggleStar(file.id, isStarred)}>
                        {isStarred ? (
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
                );
              })}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
