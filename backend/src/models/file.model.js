const pool = require("../config/db");

// create file metadata
const createFile = (data) => {
  const { name, mimeType, size, storageKey, ownerId, folderId, checksum } = data;

  return pool.query(
    `INSERT INTO files (name, mime_type, size, storage_key, owner_id, folder_id, checksum)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, name, mime_type, size, folder_id, created_at, checksum`,
    [name, mimeType, size, storageKey, ownerId, folderId || null, checksum]
  );
};

// get user files
const getUserFiles = (ownerId) => {
  return pool.query(
    `SELECT id, name, mime_type, size, folder_id, created_at
     FROM files
     WHERE owner_id = $1 AND is_deleted = false
     ORDER BY created_at DESC`,
    [ownerId]
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
    [ownerId, name, folderId]
  );
};

module.exports = {
  createFile,
  getUserFiles,
  findFile
};
