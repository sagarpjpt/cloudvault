// express app config
// all middlewares go here

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// verify server is running
app.get("/", (req, res) => {
  res.send("API is running");
});

module.exports = app;
