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
      folderId
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
      data: result.rows
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
