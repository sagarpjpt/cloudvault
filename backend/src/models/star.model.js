const pool = require("../config/db");

// add star
const addStar = ({ userId, resourceType, resourceId }) => {
  return pool.query(
    `INSERT INTO stars (user_id, resource_type, resource_id)
     VALUES ($1, $2, $3)`,
    [userId, resourceType, resourceId]
  );
};

// remove star
const removeStar = ({ userId, resourceType, resourceId }) => {
  return pool.query(
    `DELETE FROM stars
     WHERE user_id = $1 AND resource_type = $2 AND resource_id = $3`,
    [userId, resourceType, resourceId]
  );
};

// get starred items of user
const getStarred = (userId) => {
  return pool.query(
    `SELECT resource_type, resource_id, created_at
     FROM stars
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  );
};

module.exports = {
  addStar,
  removeStar,
  getStarred
};
