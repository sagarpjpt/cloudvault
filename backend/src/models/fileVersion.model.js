const pool = require("../config/db");

// get latest version number
const getLatestVersion = (fileId) => {
  return pool.query(
    `SELECT MAX(version_number) AS latest
     FROM file_versions
     WHERE file_id = $1`,
    [fileId],
  );
};

// create new version
const createVersion = (data) => {
  const { fileId, versionNumber, storageKey, size, checksum } = data;

  return pool.query(
    `INSERT INTO file_versions
     (file_id, version_number, storage_key, size, checksum)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, version_number, storage_key, size, checksum, created_at`,
    [fileId, versionNumber, storageKey, size, checksum],
  );
};

// get all versions of a file
const getVersions = (fileId) => {
  return pool.query(
    `SELECT id, version_number, size, checksum, created_at
     FROM file_versions
     WHERE file_id = $1
     ORDER BY version_number DESC`,
    [fileId],
  );
};

// get specific version
const getVersionById = (versionId) => {
  return pool.query(
    `SELECT id, file_id, version_number, storage_key, size, checksum, created_at
     FROM file_versions
     WHERE id = $1`,
    [versionId],
  );
};

// rollback file to specific version
const rollbackToVersion = (fileId, versionId) => {
  return pool.query(
    `UPDATE files
     SET storage_key = (SELECT storage_key FROM file_versions WHERE id = $1),
         updated_at = CURRENT_TIMESTAMP
     WHERE id = $2
     RETURNING id, name, storage_key, mime_type, size`,
    [versionId, fileId],
  );
};

module.exports = {
  getLatestVersion,
  createVersion,
  getVersions,
  getVersionById,
  rollbackToVersion,
};
