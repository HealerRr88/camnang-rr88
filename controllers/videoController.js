const path = require("path");
const fs = require("fs");
const db = require("../config/db");
const { convertToHLS } = require("../utils/ffmpegHelper");

exports.uploadVideo = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const inputPath = path.join(__dirname, "../uploads", req.file.filename);
  const name = path.parse(req.file.filename).name + "_" + Date.now();
  const outputDir = path.join(__dirname, "../hls", name);
  fs.mkdirSync(outputDir, { recursive: true });

  const hlsPath = `/hls/${name}/index.m3u8`;

  try {
    // 1. Lưu vào bảng upload_videos
    const [result] = await db.execute(
      "INSERT INTO upload_videos (original_name, file_name, path, status) VALUES (?, ?, ?, ?)",
      [req.file.originalname, req.file.filename, hlsPath, "processing"]
    );
    const uploadId = result.insertId;

    // 2. Convert sang HLS
    await convertToHLS(inputPath, outputDir, "index");

    // 3. Cập nhật trạng thái 'done'
    await db.execute("UPDATE upload_videos SET status = ? WHERE id = ?", ["done", uploadId]);

    res.json({ success: true, hls: hlsPath, upload_id: uploadId });
  } catch (err) {
    console.error("Upload failed:", err);
    res.status(500).json({ error: "Upload failed" });
  }
};

exports.getAllUploads = async (req, res) => {
  try {
      const [rows] = await db.execute(
          `SELECT * FROM upload_videos ORDER BY upload_videos.created_at DESC`
      );
      res.json(rows);
  } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Get all error" });
  }
};