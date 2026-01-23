const authRoutes = require("./routes/auth.routes");
const folderRoutes = require("./routes/folder.routes");
const fileRoutes = require("./routes/file.routes");
const shareRoutes = require("./routes/share.routes");
const starRoutes = require("./routes/star.routes");
const publicLinkRoutes = require("./routes/publicLink.routes");
const inviteRoutes = require("./routes/invite.routes");
const searchRoutes = require("./routes/search.routes");
const trashRoutes = require("./routes/trash.routes");
require("dotenv").config();

// express app config
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: `${process.env.FRONTEND_URL}`,
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/folders", folderRoutes);
app.use("/api/files", fileRoutes);
app.use("/api/shares", shareRoutes);
app.use("/api/stars", starRoutes);
app.use("/api/public-links", publicLinkRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/trash", trashRoutes);
app.use("/invite", inviteRoutes);

// verify server is running
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Server is running" });
});

module.exports = app;
