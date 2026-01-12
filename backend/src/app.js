const authRoutes = require('./routes/auth.routes')

// express app config
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)

// verify server is running
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

module.exports = app;
