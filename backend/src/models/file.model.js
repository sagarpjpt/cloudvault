const pool = require("../config/db");

// create file metadata
const createFile = (data) => {
  const { name, mimeType, size, storageKey, ownerId, folderId, checksum } =
    data;

  return pool.query(
    `INSERT INTO files (name, mime_type, size, storage_key, owner_id, folder_id, checksum)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, mime_type, size, folder_id, created_at, checksum`,
    [name, mimeType, size, storageKey, ownerId, folderId || null, checksum],
  );
};

// get user files
const getUserFiles = (ownerId) => {
  return pool.query(
    `SELECT id, name, mime_type, size, folder_id, created_at
     FROM files
     WHERE owner_id = $1 AND is_deleted = false
     ORDER BY created_at DESC`,
    [ownerId],
  );
};

// find file by name + folder
const findFile = (ownerId, name, folderId) => {
  return pool.query(
    `SELECT * FROM files
     WHERE owner_id = $1
       AND name = $2
       AND folder_id IS NOT DISTINCT FROM $3
       AND is_deleted = false`,
    [ownerId, name, folderId],
  );
};

// find file by ID
const findFileById = (fileId) => {
  return pool.query(
    `SELECT * FROM files WHERE id = $1 AND is_deleted = false`,
    [fileId],
  );
};

// check access to file
const checkAccess = ({ userId, fileId }) => {
  return pool.query(
    `
    SELECT 1 FROM shares
    WHERE resource_type = 'file'
      AND resource_id = $1
      AND shared_with = $2
    LIMIT 1
    `,
    [fileId, userId],
  );
};

// soft delete file
const softDeleteFile = (fileId) => {
  return pool.query(`UPDATE files SET is_deleted = true WHERE id = $1`, [
    fileId,
  ]);
};

// get files by folder
const getFilesByFolder = (folderId) => {
  return pool.query(
    `SELECT id, name, mime_type, size, folder_id, created_at
     FROM files
     WHERE folder_id = $1 AND is_deleted = false
     ORDER BY created_at DESC`,
    [folderId],
  );
};

// search files by name for a user
const searchFiles = (ownerId, searchTerm) => {
  return pool.query(
    `SELECT id, name, mime_type, size, folder_id, created_at
     FROM files
     WHERE owner_id = $1 
       AND LOWER(name) LIKE $2
       AND is_deleted = false
     ORDER BY created_at DESC
     LIMIT 20`,
    [ownerId, searchTerm],
  );
};

// update file name
const updateFileName = (fileId, newName) => {
  return pool.query(
    `UPDATE files SET name = $1 WHERE id = $2 RETURNING id, name, mime_type, size, folder_id, created_at`,
    [newName, fileId],
  );
};

// get user storage usage
const getUserStorageUsage = (ownerId) => {
  return pool.query(
    `SELECT COALESCE(SUM(size), 0) as total_size
     FROM files
     WHERE owner_id = $1 AND is_deleted = false`,
    [ownerId],
  );
};

module.exports = {
  createFile,
  getUserFiles,
  findFile,
  findFileById,
  checkAccess,
  softDeleteFile,
  getFilesByFolder,
  searchFiles,
  updateFileName,
  getUserStorageUsage,
};
