const pool = require("../config/db");

// create share
const createShare = ({ resourceType, resourceId, sharedWith, role, sharedBy }) => {
  return pool.query(
    `INSERT INTO shares
     (resource_type, resource_id, shared_with, role, shared_by)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, resource_type, resource_id, role`,
    [resourceType, resourceId, sharedWith, role, sharedBy]
  );
};

// check if user already has access
const checkAccess = ({ resourceType, resourceId, userId }) => {
  return pool.query(
    `SELECT role
     FROM shares
     WHERE resource_type = $1
       AND resource_id = $2
       AND shared_with = $3`,
    [resourceType, resourceId, userId]
  );
};

// get all shares for a user
const getSharedWithUser = (userId) => {
  return pool.query(
    `SELECT resource_type, resource_id, role, created_at
     FROM shares
     WHERE shared_with = $1`,
    [userId]
  );
};

const createPendingShare = ({ 
  resourceType, 
  resourceId, 
  email, 
  role, 
  invitedBy, 
  token, 
  expiresAt 
}) => {
  return pool.query(
    `
    INSERT INTO pending_shares
    (resource_type, resource_id, email, role, invited_by, token, expires_at)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    `,
    [resourceType, resourceId, email, role, invitedBy, token, expiresAt]
  );
};


module.exports = {
  createShare,
  checkAccess,
  getSharedWithUser,
  createPendingShare
};
