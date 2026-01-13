const pool = require("../config/db");

// create a folder
const createFolder = (name, ownerId, parentId = null) => {
  return pool.query(
    `INSERT INTO folders (name, owner_id, parent_id)
     VALUES ($1, $2, $3)
     RETURNING id, name, parent_id, created_at`,
    [name, ownerId, parentId]
  );
};

// get all folders of a user
const getUserFolders = (ownerId) => {
  return pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE owner_id = $1 AND is_deleted = false
     ORDER BY created_at DESC`,
    [ownerId]
  );
};

module.exports = {
  createFolder,
  getUserFolders,
};
