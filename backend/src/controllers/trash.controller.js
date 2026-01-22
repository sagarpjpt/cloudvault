const fileModel = require("../models/file.model");
const folderModel = require("../models/folder.model");
const supabase = require("../config/supabase");

// GET ALL TRASH ITEMS (deleted files and folders)
exports.getTrash = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const [trashFilesResult, trashFoldersResult] = await Promise.all([
      fileModel.getUserTrashFiles(ownerId),
      folderModel.getUserTrashFolders(ownerId),
    ]);

    res.status(200).json({
      success: true,
      data: {
        files: trashFilesResult.rows,
        folders: trashFoldersResult.rows,
      },
    });
  } catch (err) {
    console.error("GET TRASH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESTORE FILE FROM TRASH
exports.restoreFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user.id;

    // Check if file exists in trash
    const fileResult = await fileModel.getUserTrashFiles(userId);
    const trashedFile = fileResult.rows.find((f) => f.id === fileId);

    if (!trashedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found in trash",
      });
    }

    // Restore file
    await fileModel.restoreFile(fileId);

    res.status(200).json({
      success: true,
      message: "File restored",
    });
  } catch (err) {
    console.error("RESTORE FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RESTORE FOLDER FROM TRASH
exports.restoreFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;

    // Check if folder exists in trash
    const foldersResult = await folderModel.getUserTrashFolders(userId);
    const trashedFolder = foldersResult.rows.find((f) => f.id === folderId);

    if (!trashedFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found in trash",
      });
    }

    // Restore folder
    await folderModel.restoreFolder(folderId);

    res.status(200).json({
      success: true,
      message: "Folder restored",
    });
  } catch (err) {
    console.error("RESTORE FOLDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PERMANENTLY DELETE FILE
exports.permanentlyDeleteFile = async (req, res) => {
  try {
    const fileId = req.params.fileId;
    const userId = req.user.id;

    // Check if file exists in trash
    const fileResult = await fileModel.getUserTrashFiles(userId);
    const trashedFile = fileResult.rows.find((f) => f.id === fileId);

    if (!trashedFile) {
      return res.status(404).json({
        success: false,
        message: "File not found in trash",
      });
    }

    // Delete from storage bucket
    const storageKey = trashedFile.storage_key;
    if (!storageKey || typeof storageKey !== "string") {
      return res.status(500).json({
        success: false,
        message: "Invalid storage key",
      });
    }
    const { data, error } = await supabase.storage
      .from("cloud-vault-media-files")
      .remove([storageKey]);

    if (error) {
      console.error("Storage delete failed:", error);
      return res.status(500).json({
        success: false,
        message: "Storage delete failed",
      });
    }

    // Permanently delete db row
    await fileModel.permanentlyDeleteFile(fileId);

    res.status(200).json({
      success: true,
      message: "File permanently deleted",
    });
  } catch (err) {
    console.error("PERMANENTLY DELETE FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// PERMANENTLY DELETE FOLDER
exports.permanentlyDeleteFolder = async (req, res) => {
  try {
    const folderId = req.params.folderId;
    const userId = req.user.id;

    // Check if folder exists in trash
    const foldersResult = await folderModel.getUserTrashFolders(userId);
    const trashedFolder = foldersResult.rows.find((f) => f.id === folderId);

    if (!trashedFolder) {
      return res.status(404).json({
        success: false,
        message: "Folder not found in trash",
      });
    }

    // Permanently delete
    await folderModel.permanentlyDeleteFolder(folderId);

    res.status(200).json({
      success: true,
      message: "Folder permanently deleted",
    });
  } catch (err) {
    console.error("PERMANENTLY DELETE FOLDER ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// EMPTY TRASH
exports.emptyTrash = async (req, res) => {
  try {
    const userId = req.user.id;

    const [trashFilesResult, trashFoldersResult] = await Promise.all([
      fileModel.getUserTrashFiles(userId),
      folderModel.getUserTrashFolders(userId),
    ]);

    // delete standalone trash files
    for (const file of trashFilesResult.rows) {
      const storageKey = file.storage_key;

      if (typeof storageKey === "string" && storageKey.length > 0) {
        const { error } = await supabase.storage
          .from("cloud-vault-media-files")
          .remove([storageKey]);

        if (error) {
          console.error("Storage delete failed:", error);
          throw error;
        }
      }
      // delete db row - file meta data
      await fileModel.permanentlyDeleteFile(file.id);
    }

    // delete trash folders (handles nested files internally)
    for (const folder of trashFoldersResult.rows) {
      await folderModel.permanentlyDeleteFolder(folder.id);
    }

    res.status(200).json({
      success: true,
      message: "Trash emptied",
    });
  } catch (err) {
    console.error("EMPTY TRASH ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
