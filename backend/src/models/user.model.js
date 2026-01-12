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

module.exports = {
  findUserByEmail,
  createUser,
  findUserById
};
