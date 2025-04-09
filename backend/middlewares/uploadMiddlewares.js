// middlewares/uploadMiddleware.js
const multer = require("multer");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs-extra");

// Use memory storage so file is kept in RAM for processing
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    // Allow only images
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only images are allowed"), false);
    }
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});

// processImage middleware: converts the in-memory file to WebP and stores it
const processImage = async (req, res, next) => {
  try {
    // Make sure a file was uploaded
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Determine the desired aspect ratio from req.body or req.query
    // Expected values: "square" or "16:9"
    const aspect = req.body.aspect || req.query.aspect || "16:9";

    // Setup output dimensions based on aspect ratio
    let width, height;
    if (aspect === "1:1") {
      width = 1280;
      height = 1280;
    } else if (aspect === "16:9") {
      width = 1280;
      height = 720;
    } else {
      return res.status(400).json({ error: "Invalid aspect ratio. Use '1:1' or '16:9'." });
    }

    // Create a folder for dish images if it doesn't exist
    // const outputDir = path.join(__dirname, "uploads", "temp");
    const outputDir = path.join(__dirname, "uploads");
    await fs.ensureDir(outputDir);

    // Generate a unique file name for the processed image
    const outputFilename = `${Date.now()}.webp`;
    const outputPath = path.join(outputDir, outputFilename);

    // Process image with Sharp: resize with cover fit to crop correctly and convert to WebP
    await sharp(req.file.buffer)
      .resize(width, height, {
        fit: sharp.fit.cover,
        // sharp.fit.cover: Scales the image to cover the entire output dimensions. This may crop parts of the image if its aspect ratio doesn’t match the target.
        // sharp.fit.contain: Scales the image so that it fits completely within the output dimensions while preserving its aspect ratio. If the image’s aspect ratio differs, padding is added (using the background color you set) to fill the remaining space. This sounds like what you're looking for on Windows desktop.
        // sharp.fit.fill: Stretches the image to fill the output dimensions without preserving the aspect ratio (often referred to as “stretch”).
        position: sharp.strategy.entropy, // Focus on the most "interesting" part of the image
        position: sharp.center,
        withoutEnlargement: true,
      })
      .toFormat("webp", { quality: 80 })
      .toFile(outputPath);

    // Attach details of the processed image to the request object
    req.processedImage = { path: outputPath, filename: outputFilename, aspect, width, height };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { upload, processImage };
