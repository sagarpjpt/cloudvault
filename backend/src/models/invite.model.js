
const pool = require("../config/db");

exports.findPendingInviteByToken = (token) => {
  return pool.query(
    `
    SELECT *
    FROM pending_shares
    WHERE token = $1
    `,
    [token]
  );
};

exports.deletePendingInviteById = (id) => {
  return pool.query(
    `
    DELETE FROM pending_shares
    WHERE id = $1
    `,
    [id]
  );
};

exports.findPendingInvitesByEmail = (email) => {
  return pool.query(
    `
    SELECT *
    FROM pending_shares
    WHERE email = $1
    `,
    [email]
  );
};

exports.deletePendingInvitesByEmail = (email) => {
  return pool.query(
    `
    DELETE FROM pending_shares
    WHERE email = $1
    `,
    [email]
  );
};

