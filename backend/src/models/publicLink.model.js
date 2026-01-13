const pool = require("../config/db");

// create public link
const createPublicLink = (data) => {
  const {
    resourceType,
    resourceId,
    token,
    role,
    password,
    expiresAt,
    createdBy
  } = data;

  return pool.query(
    `INSERT INTO public_links
     (resource_type, resource_id, token, role, password, expires_at, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING token, expires_at`,
    [resourceType, resourceId, token, role, password, expiresAt, createdBy]
  );
};

// get link by token
const getByToken = (token) => {
  return pool.query(
    `SELECT *
     FROM public_links
     WHERE token = $1`,
    [token]
  );
};

module.exports = {
  createPublicLink,
  getByToken
};
