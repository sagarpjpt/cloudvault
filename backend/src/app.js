const authRoutes = require('./routes/auth.routes')
const folderRoutes = require('./routes/folder.routes')
const fileRoutes = require('./routes/file.routes')
const shareRoutes = require('./routes/share.routes')

// express app config
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes)
app.use('/api/folders', folderRoutes)
app.use('/api/files', fileRoutes)
app.use('/api/shares', shareRoutes)

// verify server is running
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

module.exports = app;
