const pool = require("../config/db");

// create a folder
const createFolder = (name, ownerId, parentId = null) => {
  return pool.query(
    `INSERT INTO folders (name, owner_id, parent_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, parent_id, created_at`,
    [name, ownerId, parentId],
  );
};

// get all folders of a user
const getUserFolders = (ownerId) => {
  return pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE owner_id = $1 AND is_deleted = false
     ORDER BY created_at DESC`,
    [ownerId],
  );
};

// get folder by ID
const getFolderById = (folderId) => {
  return pool.query(
    `SELECT * FROM folders WHERE id = $1 AND is_deleted = false`,
    [folderId],
  );
};

// find folder by name and parent
const findFolder = (name, parentId) => {
  return pool.query(
    `SELECT * FROM folders WHERE name = $1 AND parent_id IS NOT DISTINCT FROM $2 AND is_deleted = false`,
    [name, parentId],
  );
};

// get subfolders of a folder
const getSubfolders = (parentId) => {
  return pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE parent_id = $1 AND is_deleted = false
     ORDER BY name ASC`,
    [parentId],
  );
};

// soft delete folder
const softDeleteFolder = (folderId) => {
  return pool.query(`UPDATE folders SET is_deleted = true WHERE id = $1`, [
    folderId,
  ]);
};

// search folders by name for a user
const searchFolders = (ownerId, searchTerm) => {
  return pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE owner_id = $1
       AND LOWER(name) LIKE $2
       AND is_deleted = false
     ORDER BY created_at DESC
     LIMIT 20`,
    [ownerId, searchTerm],
  );
};

// update folder name
const updateFolderName = (folderId, newName) => {
  return pool.query(
    `UPDATE folders SET name = $1 WHERE id = $2 RETURNING id, name, parent_id, created_at`,
    [newName, folderId],
  );
};

module.exports = {
  createFolder,
  getUserFolders,
  getFolderById,
  findFolder,
  getSubfolders,
  softDeleteFolder,
  searchFolders,
  updateFolderName,
};
