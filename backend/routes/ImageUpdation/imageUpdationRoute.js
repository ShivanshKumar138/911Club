const express = require("express");
const router = express.Router();
const {
  updateLogo,
  addBannerImages,
  updateBannerImage,
  deleteBannerImage,
  getSiteSettings,
} = require("../../controllers/SiteSettingsController");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Endpoint to update logo
router.post(
  "/api/site-settings/update-logo",
  auth,
  isAdmin,
  upload.single("file"), // Ensure "file" matches the form-data key
  updateLogo
);

// Endpoint to add banner images
router.post(
  '/api/site-settings/add-banner-images',
  auth,
  isAdmin,
  upload.array('files', 5), // Accept up to 5 files
  addBannerImages
);

// Endpoint to update specific banner images by ID
router.post(
  '/api/site-settings/update-banner/:id',
  auth,
  isAdmin,
  upload.single('files'), // For a single file
  updateBannerImage
);

// Endpoint to delete a banner image by ID using request body data
router.delete(
  '/api/site-settings/delete-banner/:id',
  auth,
  isAdmin,
  deleteBannerImage
);

// Route to get site settings including logo and banner images
router.get("/api/site-settings", getSiteSettings);

module.exports = router;
