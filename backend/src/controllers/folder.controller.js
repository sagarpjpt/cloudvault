const folderModel = require("../models/folder.model");
const activityModel = require("../models/activity.model");

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

    const result = await folderModel.createFolder(name, ownerId, parentId);
    const folderId = result.rows[0].id;

    // Log activity
    await activityModel
      .logActivity({
        actorId: ownerId,
        action: "upload",
        resourceType: "folder",
        resourceId: folderId,
        context: {
          folderName: name,
        },
      })
      .catch((err) => console.error("Activity logging failed:", err));

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

// GET FOLDER CONTENTS (files and subfolders)
exports.getFolderContents = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user.id;

    // Check if user has access to folder
    const folderResult = await folderModel.getFolderById(folderId);

    if (folderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const folder = folderResult.rows[0];

    // Check if owner
    if (folder.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // Get subfolders
    const subfolders = await folderModel.getSubfolders(folderId);

    // Get files in this folder
    const fileModel = require("../models/file.model");
    const files = await fileModel.getFilesByFolder(folderId);

    res.status(200).json({
      success: true,
      data: {
        folder: folder,
        subfolders: subfolders.rows,
        files: files.rows,
      },
    });
  } catch (err) {
    console.error("GET FOLDER CONTENTS ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE FOLDER
exports.deleteFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const userId = req.user.id;

    // Check if user owns folder
    const folderResult = await folderModel.getFolderById(folderId);

    if (folderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const folder = folderResult.rows[0];

    if (folder.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only folder owner can delete",
      });
    }

    // Remove stars for this folder before deleting
    const starModel = require("../models/star.model");
    try {
      await starModel.removeStarByResource({
        resourceType: "folder",
        resourceId: folderId,
      });
    } catch (err) {
      console.error("Error removing stars:", err);
    }

    // Soft delete folder and all its contents recursively
    await folderModel.softDeleteFolderRecursive(folderId);

    // Log activity
    await activityModel
      .logActivity({
        actorId: userId,
        action: "delete",
        resourceType: "folder",
        resourceId: folderId,
        context: {
          folderName: folder.name,
        },
      })
      .catch((err) => console.error("Activity logging failed:", err));

    res.status(200).json({
      success: true,
      message: "Folder deleted",
    });
  } catch (err) {
    console.error("DELETE FOLDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RENAME FOLDER
exports.renameFolder = async (req, res) => {
  try {
    const folderId = req.params.id;
    const { newName } = req.body;
    const userId = req.user.id;

    if (!newName || !newName.trim()) {
      return res.status(400).json({
        success: false,
        message: "Folder name is required",
      });
    }

    // Check if user owns folder
    const folderResult = await folderModel.getFolderById(folderId);

    if (folderResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Folder not found",
      });
    }

    const folder = folderResult.rows[0];

    if (folder.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only folder owner can rename",
      });
    }

    // Check for duplicate name in same parent folder
    const parentId = folder.parent_id;
    const duplicateResult = await folderModel.findFolder(
      newName.trim(),
      parentId,
    );

    if (duplicateResult.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "A folder with this name already exists",
      });
    }

    // Update folder name
    const result = await folderModel.updateFolderName(folderId, newName.trim());

    // Log activity
    await activityModel
      .logActivity({
        actorId: userId,
        action: "rename",
        resourceType: "folder",
        resourceId: folderId,
        context: {
          oldName: folder.name,
          newName: newName.trim(),
        },
      })
      .catch((err) => console.error("Activity logging failed:", err));

    res.status(200).json({
      success: true,
      message: "Folder renamed successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("RENAME FOLDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
