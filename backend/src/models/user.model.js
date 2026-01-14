// all user related DB queries live here

const pool = require("../config/db");

const findUserByEmail = (email) => {
  return pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );
};

const createUser = (email, hashedPassword, name) => {
  return pool.query(
    `INSERT INTO users (email, password, name)
     VALUES ($1, $2, $3)
     RETURNING id, email, name`,
    [email, hashedPassword, name]
  );
};

const findUserById = (id) => {
  return pool.query(
    "SELECT id, email, name, created_at FROM users WHERE id = $1",
    [id]
  );
};

const verifyUserEmail = (email) => {
  return pool.query(
    "UPDATE users SET email_verified = true WHERE email = $1",
    [email]
  );
};

const updateUserPassword = (email, hashedPassword) => {
  return pool.query(
    "UPDATE users SET password = $1 WHERE email = $2",
    [hashedPassword, email]
  );
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  verifyUserEmail,
  updateUserPassword
};
