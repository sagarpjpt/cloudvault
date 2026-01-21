const fileModel = require("../models/file.model");
const supabase = require("../config/supabase");
const crypto = require("crypto");
const fileVersionModel = require("../models/fileVersion.model");

// CREATE FILE METADATA
exports.createFile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const { name, mimeType, size, storageKey, folderId } = req.body;

    if (!name || !storageKey) {
      return res.status(400).json({
        success: false,
        message: "File name and storage key are required",
      });
    }

    const result = await fileModel.createFile({
      name,
      mimeType,
      size,
      storageKey,
      ownerId,
      folderId,
    });

    res.status(201).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    console.error("CREATE FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// LIST USER FILES
exports.getFiles = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const result = await fileModel.getUserFiles(ownerId);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    console.error("GET FILES ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// UPLOAD FILE CONTROLLER
exports.uploadFile = async (req, res) => {
  try {
    const ownerId = req.user.id;
    const file = req.file;
    const { folderId = null } = req.body;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "File is required",
      });
    }

    // calculate checksum (used for integrity + deduplication later)
    const checksum = crypto
      .createHash("sha256")
      .update(file.buffer)
      .digest("hex");

    // check if file with same name already exists in same folder
    const existingFile = await fileModel.findFile(
      ownerId,
      file.originalname,
      folderId,
    );

    let fileId;
    let versionNumber = 1;

    // generate storage key (version-specific, not reused)
    const fileExt = file.originalname.split(".").pop();
    const uniqueName = crypto.randomUUID();
    const storageKey = `users/${ownerId}/${uniqueName}.${fileExt}`;

    if (existingFile.rows.length > 0) {
      // file exists → create new version
      fileId = existingFile.rows[0].id;

      const latest = await fileVersionModel.getLatestVersion(fileId);
      versionNumber = (latest.rows[0]?.latest || 0) + 1;
    } else {
      // new file → create base file record
      const newFile = await fileModel.createFile({
        name: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        storageKey, // initial pointer, updated via versions later
        ownerId,
        folderId,
        checksum,
      });

      fileId = newFile.rows[0].id;
    }

    // upload file to Supabase Storage
    const { error } = await supabase.storage
      .from("cloud-vault-media-files")
      .upload(storageKey, file.buffer, {
        contentType: file.mimetype,
      });

    if (error) {
      console.error("SUPABASE UPLOAD ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "File upload failed",
      });
    }

    // create file version entry (always)
    await fileVersionModel.createVersion({
      fileId,
      versionNumber,
      storageKey,
      size: file.size,
      checksum,
    });

    res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: {
        fileId,
        version: versionNumber,
      },
    });
  } catch (err) {
    console.error("UPLOAD FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET FILE VERSIONS
exports.getFileVersions = async (req, res) => {
  try {
    const fileId = req.params.id;

    const result = await fileVersionModel.getVersions(fileId);

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DOWNLOAD FILE
exports.downloadFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    console.log("DOWNLOAD REQUEST: fileId=", fileId, "userId=", userId);

    // Get file metadata
    const fileResult = await fileModel.findFileById(fileId);

    if (fileResult.rows.length === 0) {
      console.log("FILE NOT FOUND:", fileId);
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = fileResult.rows[0];
    console.log("FILE FOUND:", file.name, "storage_key:", file.storage_key);

    // Check permission (owner or shared with permission)
    if (file.owner_id !== userId) {
      // Check if shared
      const accessResult = await fileModel.checkAccess({
        userId,
        fileId,
      });

      if (accessResult.rows.length === 0) {
        console.log("ACCESS DENIED for user:", userId);
        return res.status(403).json({
          success: false,
          message: "Access denied",
        });
      }
    }

    console.log("DOWNLOADING FROM SUPABASE:", file.storage_key);

    // Get file from Supabase
    const { data, error } = await supabase.storage
      .from("cloud-vault-media-files")
      .download(file.storage_key);

    if (error) {
      console.error("SUPABASE DOWNLOAD ERROR:", error);
      return res.status(500).json({
        success: false,
        message: "File download failed",
      });
    }

    // Handle different data types from Supabase (Blob, Uint8Array, Buffer, etc.)
    // Blob has .size, Uint8Array has .byteLength, Buffer/Array has .length
    const dataSize = data.size || data.byteLength || data.length;
    console.log(
      "FILE DOWNLOADED, SIZE:",
      dataSize,
      "TYPE:",
      typeof data,
      "CONSTRUCTOR:",
      data.constructor.name,
    );

    // Convert Blob to Buffer if needed
    const buffer =
      data instanceof Blob ? Buffer.from(await data.arrayBuffer()) : data;

    // Set response headers for download
    res.setHeader("Content-Type", file.mime_type);
    res.setHeader("Content-Disposition", `attachment; filename="${file.name}"`);
    if (dataSize) {
      res.setHeader("Content-Length", dataSize);
    }

    res.send(buffer);
  } catch (err) {
    console.error("DOWNLOAD FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// DELETE FILE
exports.deleteFile = async (req, res) => {
  try {
    const fileId = req.params.id;
    const userId = req.user.id;

    // Get file
    const fileResult = await fileModel.findFileById(fileId);

    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = fileResult.rows[0];

    // Check permission (only owner can delete)
    if (file.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only file owner can delete",
      });
    }

    // Remove stars for this file before deleting
    const starModel = require("../models/star.model");
    try {
      await starModel.removeStarByResource({
        resourceType: "file",
        resourceId: fileId,
      });
    } catch (err) {
      console.error("Error removing stars:", err);
    }

    // Soft delete (mark as deleted)
    await fileModel.softDeleteFile(fileId);

    res.status(200).json({
      success: true,
      message: "File deleted",
    });
  } catch (err) {
    console.error("DELETE FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// RENAME FILE
exports.renameFile = async (req, res) => {
  try {
    const userId = req.user.id;
    const fileId = req.params.id;
    const { newName } = req.body;

    if (!newName || newName.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "New file name is required",
      });
    }

    // Check if file exists and user owns it
    const fileResult = await fileModel.findFileById(fileId);
    if (fileResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "File not found",
      });
    }

    const file = fileResult.rows[0];

    // Only owner can rename
    if (file.owner_id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Only file owner can rename",
      });
    }

    // Check if a file with the same name already exists in this folder
    const existingFile = await fileModel.findFile(
      userId,
      newName.trim(),
      file.folder_id,
    );
    if (existingFile.rows.length > 0 && existingFile.rows[0].id !== fileId) {
      return res.status(409).json({
        success: false,
        message: "A file with this name already exists in this folder",
      });
    }

    // Update file name
    const result = await fileModel.updateFileName(fileId, newName.trim());

    res.status(200).json({
      success: true,
      message: "File renamed successfully",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("RENAME FILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// GET STORAGE USAGE
exports.getStorageUsage = async (req, res) => {
  try {
    const userId = req.user.id;
    const MAX_STORAGE = 2 * 1024 * 1024 * 1024; // 2GB in bytes

    const result = await fileModel.getUserStorageUsage(userId);
    const totalSize = result.rows[0]?.total_size || 0;
    const usedPercentage = (totalSize / MAX_STORAGE) * 100;

    res.status(200).json({
      success: true,
      data: {
        usedBytes: totalSize,
        totalBytes: MAX_STORAGE,
        usedGB: (totalSize / (1024 * 1024 * 1024)).toFixed(2),
        totalGB: 2,
        percentage: Math.min(usedPercentage, 100),
        canUpload: totalSize < MAX_STORAGE,
      },
    });
  } catch (err) {
    console.error("GET STORAGE USAGE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
