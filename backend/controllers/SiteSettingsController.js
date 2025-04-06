const SiteSettings = require("../models/SiteSettingsSchema");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const multer = require("multer");
const path = require("path");
const cloudinary = require('cloudinary').v2;

// Initialize multer storage and configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/public/banners/"); // Set your upload directory here
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Use a unique name for the file
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    // Set file filter logic here
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new multer.MulterError("Unexpected field"), false);
    }
  },
});

// const initializeSiteSettings = async () => {
//   try {
//       let siteSettings = await SiteSettings.findOne();
//       if (!siteSettings) {
//           siteSettings = new SiteSettings();
//           await siteSettings.save();
//           console.log("Default site settings created");
//       }
//   } catch (error) {
//       console.error("Error initializing site settings:", error);
//   }
// };

// initializeSiteSettings();

// Function to update the logo
exports.updateLogo = async (req, res) => {
  try {
    console.log("Received request to update logo");
    const file = req.file;

    if (!file) {
      console.log("No file uploaded");
      return res.status(400).json({ message: "No file uploaded" });
    }

    console.log("File received:", file.originalname);

    const result = await uploadImageToCloudinary(file, "logos", null, null);
    console.log("File uploaded to Cloudinary:", result.secure_url);

    let siteSettings = await SiteSettings.findOne();
    if (!siteSettings) {
      siteSettings = new SiteSettings();
    }

    siteSettings.logoUrl = result.secure_url;
    siteSettings.updatedAt = new Date();

    await siteSettings.save();
    console.log("Site settings updated:", siteSettings);

    res
      .status(200)
      .json({
        message: "Logo updated successfully",
        logoUrl: siteSettings.logoUrl,
      });
  } catch (error) {
    console.error("Error updating logo:", error);
    res
      .status(500)
      .json({ message: "Failed to update logo", error: error.message });
  }
};

exports.addBannerImages = async (req, res) => {
    try {
        console.log('Received request to add banner images');
        
        // Ensure files are properly parsed
        if (!req.files || req.files.length === 0) {
            console.log('No files uploaded');
            return res.status(400).json({ message: 'No files uploaded' });
        }

        // Log file details for debugging
        console.log('Request Files:', req.files);

        // Upload files to Cloudinary
        const imageUrls = await Promise.all(req.files.map(file => uploadImageToCloudinary(file)));
        console.log('Files uploaded to Cloudinary:', imageUrls.map(result => result.secure_url));

        // Prepare banner images array
        const bannerImages = imageUrls.map(result => ({ imageUrl: result.secure_url }));

        // Find or create site settings
        let siteSettings = await SiteSettings.findOne();
        if (!siteSettings) {
            siteSettings = new SiteSettings();
        }

        // Update banner images
        siteSettings.bannerImages.push(...bannerImages);
        siteSettings.updatedAt = new Date();

        // Save changes
        await siteSettings.save();
        console.log('Site settings updated:', siteSettings);

        res.status(200).json({
            message: 'Banner images added successfully',
            bannerImages: siteSettings.bannerImages,
        });
    } catch (error) {
        console.error('Error adding banner images:', error);
        res.status(500).json({ message: 'Failed to add banner images', error: error.message });
    }
};
// Function to update a specific banner image
exports.updateBannerImage = async (req, res) => {
    try {
        console.log('Received request to update a banner image');

        const bannerId = req.params.id;; // ID of the banner to update
        const file = req.file; // Uploaded file

        if (!bannerId) {
            console.log('No banner ID provided');
            return res.status(400).json({ message: 'No banner ID provided' });
        }

        if (!file) {
            console.log('No file uploaded');
            return res.status(400).json({ message: 'No file uploaded' });
        }

        console.log('File received:', file.originalname);

        // Upload the file to Cloudinary
        const result = await uploadImageToCloudinary(file);
        const imageUrl = result.secure_url;
        console.log('File uploaded to Cloudinary:', imageUrl);

        // Find and update the banner image
        const siteSettings = await SiteSettings.findOne();
        if (!siteSettings) {
            return res.status(404).json({ message: 'Site settings not found' });
        }

        const banner = siteSettings.bannerImages.id(bannerId);
        if (!banner) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        banner.imageUrl = imageUrl;
        siteSettings.updatedAt = new Date();

        await siteSettings.save();
        console.log('Site settings updated:', siteSettings);

        res.status(200).json({
            message: 'Banner image updated successfully',
            bannerImages: siteSettings.bannerImages,
        });
    } catch (error) {
        console.error('Error updating banner image:', error);
        res.status(500).json({ message: 'Failed to update banner image', error: error.message });
    }
};

// Function to delete a specific banner image by ID using request body data
exports.deleteBannerImage = async (req, res) => {
    try {
        console.log('Received request to delete a banner image');

        const bannerId = req.params.id; // Get the banner ID from request body

        if (!bannerId) {
            console.log('No banner ID provided');
            return res.status(400).json({ message: 'No banner ID provided' });
        }

        // Find the site settings
        const siteSettings = await SiteSettings.findOne();
        if (!siteSettings) {
            return res.status(404).json({ message: 'Site settings not found' });
        }

        // Find the index of the banner to be removed
        const index = siteSettings.bannerImages.findIndex(banner => banner._id.toString() === bannerId);
        if (index === -1) {
            return res.status(404).json({ message: 'Banner not found' });
        }

        // Remove the image from Cloudinary
        const publicId = siteSettings.bannerImages[index].imageUrl.split('/').pop().split('.')[0]; // Extract the public ID from the URL
        await cloudinary.uploader.destroy(publicId); // Delete the image from Cloudinary

        // Remove the banner from the array
        siteSettings.bannerImages.splice(index, 1);
        siteSettings.updatedAt = new Date();

        await siteSettings.save();
        console.log('Banner image deleted successfully:', siteSettings);

        res.status(200).json({
            message: 'Banner image deleted successfully',
            bannerImages: siteSettings.bannerImages,
        });
    } catch (error) {
        console.error('Error deleting banner image:', error);
        res.status(500).json({ message: 'Failed to delete banner image', error: error.message });
    }
};

// Function to get site settings including logo and banner images
exports.getSiteSettings = async (req, res) => {
    try {
    //   console.log("Received request to get site settings");
  
      const siteSettings = await SiteSettings.findOne();
      if (!siteSettings) {
        return res.status(404).json({ message: "Site settings not found" });
      }
  
      // Destructure the site settings object
      const { logoUrl, bannerImages } = siteSettings;
  
      // Create a banners object with possible empty values
      const banners = bannerImages.map((banner, index) => ({
        id: banner._id,
        imageUrl: banner.imageUrl || "", // Ensure imageUrl is set
      }));
  
      res.status(200).json({
        message: "Site settings retrieved successfully",
        logoUrl: logoUrl || "", // Ensure logoUrl is set
        banners,
      });
    } catch (error) {
      console.error("Error retrieving site settings:", error);
      res.status(500).json({
        message: "Failed to retrieve site settings",
        error: error.message,
      });
    }
  };
  