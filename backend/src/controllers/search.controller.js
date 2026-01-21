const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");

exports.search = async (req, res) => {
  try {
    const userId = req.user.id;
    const { query } = req.query;

    // Validate search query
    if (!query || query.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Search query is required",
      });
    }

    const searchTerm = `%${query.toLowerCase()}%`;

    // Search files by name
    const filesResult = await fileModel.searchFiles(userId, searchTerm);

    // Search folders by name
    const foldersResult = await folderModel.searchFolders(userId, searchTerm);

    res.status(200).json({
      success: true,
      data: {
        files: filesResult.rows || [],
        folders: foldersResult.rows || [],
        query,
      },
    });
  } catch (err) {
    console.error("SEARCH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
