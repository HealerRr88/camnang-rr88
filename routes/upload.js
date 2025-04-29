const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const videoController = require("../controllers/videoController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

const upload = multer({ storage });

router.post("/", upload.single("video"), videoController.uploadVideo);
router.get("/", videoController.getAllUploads);

module.exports = router;
