// pg is postgreSQL client for Node.js
// Client → single connection
// Pool → multiple connections (better performance, scalable)
const {Pool} = require('pg');
require("dotenv").config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
}) 

module.exports = pool;