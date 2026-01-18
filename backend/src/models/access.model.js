const pool = require('../config/db')

exports.canEditResource = async ({ userId, resourceType, resourceId }) => {
  // 
  // FILE PERMISSION
  // 
  if (resourceType === "file") {
    const result = await pool.query(
      `
      -- 1. File owner
      SELECT 1
      FROM files
      WHERE id = $1 AND owner_id = $2

      UNION

      -- 2. File shared directly as EDITOR
      SELECT 1
      FROM shares
      WHERE resource_type = 'file'
        AND resource_id = $1
        AND shared_with = $2
        AND role = 'EDITOR'

      UNION

      -- 3. File inside a folder shared as EDITOR
      SELECT 1
      FROM files f
      JOIN shares s
        ON s.resource_type = 'folder'
       AND s.resource_id = f.folder_id
       AND s.shared_with = $2
       AND s.role = 'EDITOR'
      WHERE f.id = $1
      `,
      [resourceId, userId]
    );

    return result.rows.length > 0;
  }

  // 
  // FOLDER PERMISSION
  // 
  if (resourceType === "folder") {
    const result = await pool.query(
      `
      -- 1. Folder owner
      SELECT 1
      FROM folders
      WHERE id = $1 AND owner_id = $2

      UNION

      -- 2. Folder shared directly as EDITOR
      SELECT 1
      FROM shares
      WHERE resource_type = 'folder'
        AND resource_id = $1
        AND shared_with = $2
        AND role = 'EDITOR'

      UNION

      -- 3. Parent folder shared as EDITOR (inheritance)
      WITH RECURSIVE parent_folders AS (
        SELECT id, parent_id
        FROM folders
        WHERE id = $1

        UNION ALL

        SELECT f.id, f.parent_id
        FROM folders f
        JOIN parent_folders pf ON pf.parent_id = f.id
      )
      SELECT 1
      FROM parent_folders pf
      JOIN shares s
        ON s.resource_type = 'folder'
       AND s.resource_id = pf.id
       AND s.shared_with = $2
       AND s.role = 'EDITOR'
      `,
      [resourceId, userId]
    );

    return result.rows.length > 0;
  }

  return false;
};
