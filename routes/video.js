const express = require("express");
const router = express.Router();
const multer = require("multer");
const {
    createVideo,
    getVideoById,
    deleteVideo,
    getAllVideos,
    updateVideo,
    getLatestVideo,
    getVideosByCategory
} = require("../controllers/videoInfoController");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/thumbs"),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

router.post("/", upload.single("thumb"), createVideo);
router.get("/latest", getLatestVideo);
router.get("/by-category", getVideosByCategory);
router.get("/:id", getVideoById);
router.delete("/:id", deleteVideo);
router.get("/", getAllVideos);
router.put("/:id", upload.single("thumb"), updateVideo);


module.exports = router;