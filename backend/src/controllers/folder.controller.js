const folderModel = require("../models/folder.model");

// CREATE FOLDER
exports.createFolder = async (req, res) => {
  try {
    const { name, parentId } = req.body;
    const ownerId = req.user.id;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    const result = await folderModel.createFolder(
      name,
      ownerId,
      parentId
    );

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("CREATE FOLDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LIST USER FOLDERS
exports.getFolders = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const result = await folderModel.getUserFolders(ownerId);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET FOLDERS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
