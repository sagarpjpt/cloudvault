const pool = require("../config/db");

// get latest version number
const getLatestVersion = (fileId) => {
  return pool.query(
    `SELECT MAX(version_number) AS latest
     FROM file_versions
     WHERE file_id = $1`,
    [fileId]
  );
};

// create new version
const createVersion = (data) => {
  const {
    fileId,
    versionNumber,
    storageKey,
    size,
    checksum
  } = data;

  return pool.query(
    `INSERT INTO file_versions
     (file_id, version_number, storage_key, size, checksum)
     VALUES ($1, $2, $3, $4, $5)`,
    [fileId, versionNumber, storageKey, size, checksum]
  );
};

// get all versions of a file
const getVersions = (fileId) => {
  return pool.query(
    `SELECT version_number, size, checksum, created_at
     FROM file_versions
     WHERE file_id = $1
     ORDER BY version_number DESC`,
    [fileId]
  );
};

module.exports = {
  getLatestVersion,
  createVersion,
  getVersions
};
