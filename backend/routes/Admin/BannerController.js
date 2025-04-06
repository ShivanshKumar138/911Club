// Required dependencies
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Configure Multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/banner";

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// File filter function to accept only images
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed!"), false);
  }
};

// Initialize multer with configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Define Banner Schema
const bannerSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    enum: [
      "1ST_DEPOSIT",
      "2ND_DEPOSIT",
      "INVITATION_BONUS",
      "TEAM_COMMISSION",
      "WINNING_STREAK_BONUS",
      "ATTENDANCE_BONUS",
      "DAILY_SALARY_BONUS",
      "ADS_FUND",
      "HOLD_ADVANCE",
      "OFFICIAL_PREDICTION_CHANNEL",
      "LOOKING_FOR_AGENT",
    ],
  },
  description: {
    type: String,
    required: true,
  },
  imagePath: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
  },
  order: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Pre-save hook to update the updatedAt field
bannerSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Create model
const Banner = mongoose.model("Banner", bannerSchema);

// Routes

// POST - Upload a new banner
router.post(
  "/upload/banner",
  upload.single("bannerImage"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No image uploaded" });
      }

      const { title, description, order } = req.body;

      // Validate required fields
      if (!title || !description) {
        // Remove uploaded file if validation fails
        fs.unlinkSync(req.file.path);
        return res.status(400).json({
          success: false,
          message: "Title and description are required",
        });
      }

      // Create new banner document
      const newBanner = new Banner({
        title,
        description,
        imagePath: req.file.path,
        order: order || 0,
      });

      // Save to database
      await newBanner.save();

      res.status(201).json({
        success: true,
        message: "Banner uploaded successfully",
        data: newBanner,
      });
    } catch (error) {
      // Remove uploaded file in case of error
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: "Error uploading banner",
        error: error.message,
      });
    }
  }
);

// GET - Retrieve all banners
router.get("/banner", async (req, res) => {
  try {
    const banners = await Banner.find().sort({ order: 1, createdAt: -1 });
    res.status(200).json({
      success: true,
      count: banners.length,
      data: banners,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving banners",
      error: error.message,
    });
  }
});

// GET - Retrieve a specific banner
router.get("/banner/perticular/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    res.status(200).json({
      success: true,
      data: banner,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving banner",
      error: error.message,
    });
  }
});

// PUT - Update a banner
router.put(
  "/banner/perticular/:id",
  upload.single("bannerImage"),
  async (req, res) => {
    try {
      const banner = await Banner.findById(req.params.id);

      if (!banner) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({
          success: false,
          message: "Banner not found",
        });
      }

      // Update fields if provided
      if (req.body.title) banner.title = req.body.title;
      if (req.body.description) banner.description = req.body.description;
      if (req.body.order) banner.order = req.body.order;
      if (req.body.active !== undefined) banner.active = req.body.active;

      // If new image is uploaded, delete old one and update path
      if (req.file) {
        // Delete old image if it exists
        if (fs.existsSync(banner.imagePath)) {
          fs.unlinkSync(banner.imagePath);
        }
        banner.imagePath = req.file.path;
      }

      // Save updated banner
      await banner.save();

      res.status(200).json({
        success: true,
        message: "Banner updated successfully",
        data: banner,
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }

      res.status(500).json({
        success: false,
        message: "Error updating banner",
        error: error.message,
      });
    }
  }
);

// DELETE - Remove a banner
router.delete("/banner/perticular/:id", async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);

    if (!banner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found",
      });
    }

    // Delete image file from storage
    if (fs.existsSync(banner.imagePath)) {
      fs.unlinkSync(banner.imagePath);
    }

    // Remove from database
    await Banner.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting banner",
      error: error.message,
    });
  }
});

module.exports = router;
