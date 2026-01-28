const pool = require("../config/db");

// Log activity/audit event
const logActivity = async (data) => {
  const { actorId, action, resourceType, resourceId, context } = data;

  return pool.query(
    `INSERT INTO activities (actor_id, action, resource_type, resource_id, context)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, created_at`,
    [actorId, action, resourceType, resourceId, JSON.stringify(context || {})],
  );
};

// Get activities for a resource
const getResourceActivities = (
  resourceType,
  resourceId,
  limit = 50,
  offset = 0,
) => {
  return pool.query(
    `SELECT 
       a.id, 
       a.actor_id, 
       a.action, 
       a.resource_type, 
       a.resource_id, 
       a.context, 
       a.created_at,
       u.name as actor_name, 
       u.email as actor_email
     FROM activities a
     LEFT JOIN users u ON a.actor_id = u.id
     WHERE a.resource_type = $1 AND a.resource_id = $2
     ORDER BY a.created_at DESC
     LIMIT $3 OFFSET $4`,
    [resourceType, resourceId, limit, offset],
  );
};

// Get user activities
const getUserActivities = (userId, limit = 100, offset = 0) => {
  return pool.query(
    `SELECT id, actor_id, action, resource_type, resource_id, context, created_at
     FROM activities
     WHERE actor_id = $1
     ORDER BY created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
};

// Get activities in a time range
const getActivitiesByDateRange = (startDate, endDate, limit = 100) => {
  return pool.query(
    `SELECT id, actor_id, action, resource_type, resource_id, context, created_at
     FROM activities
     WHERE created_at BETWEEN $1 AND $2
     ORDER BY created_at DESC
     LIMIT $3`,
    [startDate, endDate, limit],
  );
};

// Get all activities for a user (file + folder)
const getUserFileAndFolderActivities = (userId, limit = 50, offset = 0) => {
  return pool.query(
    `SELECT a.id, a.actor_id, a.action, a.resource_type, a.resource_id, a.context, a.created_at, u.name, u.email
     FROM activities a
     LEFT JOIN users u ON a.actor_id = u.id
     WHERE a.resource_type IN ('file', 'folder')
       AND (a.resource_id IN (
         SELECT id FROM files WHERE owner_id = $1
         UNION
         SELECT id FROM folders WHERE owner_id = $1
       ) OR a.actor_id = $1)
     ORDER BY a.created_at DESC
     LIMIT $2 OFFSET $3`,
    [userId, limit, offset],
  );
};

module.exports = {
  logActivity,
  getResourceActivities,
  getUserActivities,
  getActivitiesByDateRange,
  getUserFileAndFolderActivities,
};
