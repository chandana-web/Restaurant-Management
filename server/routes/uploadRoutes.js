const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Define where images are saved and with what filename
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, "uploads/"); // folder name
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Initialize multer upload
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) cb(null, true);
    else cb(new Error("Only image files are allowed!"));
  },
});


// POST route to upload image
router.post("/", upload.single("image"), (req, res) => {
  res.json({
    message: "Image uploaded successfully",
    imageUrl: `/uploads/${req.file.filename}`,
  });
});

module.exports = router;
