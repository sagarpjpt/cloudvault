const pool = require("../config/db");
const supabase = require("../config/supabase");
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

// soft delete folder and all its contents recursively
const softDeleteFolderRecursive = async (folderId) => {
  try {
    // First, soft delete all subfolders recursively
    const subfolders = await pool.query(
      `SELECT id FROM folders WHERE parent_id = $1`,
      [folderId],
    );

    for (const subfolder of subfolders.rows) {
      await softDeleteFolderRecursive(subfolder.id);
    }

    // Soft delete all files in this folder
    await pool.query(
      `UPDATE files SET is_deleted = true WHERE folder_id = $1`,
      [folderId],
    );

    // Soft delete the folder itself
    return await pool.query(
      `UPDATE folders SET is_deleted = true WHERE id = $1`,
      [folderId],
    );
  } catch (err) {
    throw err;
  }
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

// get user trash folders
const getUserTrashFolders = (ownerId) => {
  return pool.query(
    `SELECT id, name, parent_id, created_at
     FROM folders
     WHERE owner_id = $1 AND is_deleted = true
     ORDER BY created_at DESC`,
    [ownerId],
  );
};

// restore folder from trash
const restoreFolder = (folderId) => {
  return pool.query(
    `UPDATE folders SET is_deleted = false WHERE id = $1 RETURNING *`,
    [folderId],
  );
};

// permanently delete folder and all its contents
// const permanentlyDeleteFolder = async (folderId) => {
//   // First get all subfolders recursively and delete them
//   const deleteSubfolders = async (parentId) => {
//     const result = await pool.query(
//       `SELECT id FROM folders WHERE parent_id = $1`,
//       [parentId],
//     );
//     for (const folder of result.rows) {
//       await deleteSubfolders(folder.id);
//     }
//   };

//   await deleteSubfolders(folderId);

//   // Delete all files in folder
//   await pool.query(`DELETE FROM files WHERE folder_id = $1`, [folderId]);

//   // Delete the folder itself
//   return pool.query(`DELETE FROM folders WHERE id = $1`, [folderId]);
// };
const permanentlyDeleteFolder = async (folderId) => {
  // 1. get all nested folders
  const subfolderIds = await getAllSubfolderIds(folderId);
  const allFolderIds = [folderId, ...subfolderIds];

  // 2. get all files inside all folders
  const filesResult = await pool.query(
    `
    SELECT id, storage_key
    FROM files
    WHERE folder_id = ANY($1)
    `,
    [allFolderIds],
  );

  // 3. delete from storage
  await deleteFilesFromStorage(filesResult.rows);

  // 4. delete files from DB
  await pool.query(`DELETE FROM files WHERE folder_id = ANY($1)`, [
    allFolderIds,
  ]);

  // 5. delete folders (children first is already handled)
  await pool.query(`DELETE FROM folders WHERE id = ANY($1)`, [allFolderIds]);
};

// get all subfolders
const getAllSubfolderIds = async (folderId, ids = []) => {
  const result = await pool.query(
    `SELECT id FROM folders WHERE parent_id = $1`,
    [folderId],
  );

  for (const row of result.rows) {
    ids.push(row.id);
    await getAllSubfolderIds(row.id, ids);
  }

  return ids;
};

// delete files from supabase
const deleteFilesFromStorage = async (files) => {
  const keys = files.map((f) => f.storage_key);

  if (keys.length === 0) return;

  // Delete from storage bucket
  const { data, error } = await supabase.storage
    .from("cloud-vault-media-files")
    .remove(keys);

  if (error) {
    console.error("Storage deletion failed:", error);
    throw error;
  }
};

module.exports = {
  createFolder,
  getUserFolders,
  getFolderById,
  findFolder,
  getSubfolders,
  softDeleteFolder,
  softDeleteFolderRecursive,
  searchFolders,
  updateFolderName,
  getUserTrashFolders,
  restoreFolder,
  permanentlyDeleteFolder,
};
