const express = require('express');
const router = express.Router();
const UPIAddress = require('../../models/UPI_IDSchema');
const auth = require('../../middlewares/auth');
const {isAdmin} = require('../../middlewares/roleSpecificMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './public/uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/upsertID', auth, isAdmin, upload.single('image'), async (req, res) => {
  try {
    const { Upi, Trx } = req.body;
    let imageUrl = '';
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`; // Relative URL to the uploaded image
    }

    if (!Upi || !Trx) {
      return res.status(400).json({
        message: "Please Enter The UPI ID and Trx"
      });
    }

    let upiID = await UPIAddress.findOne({ user: req.user._id });

    if (upiID) {
      // UPI ID exists, update it
      upiID.Upi = Upi;
      upiID.Trx = Trx;
      if (imageUrl) upiID.imageUrl = imageUrl;
      await upiID.save();
      res.status(200).json({
        success: true,
        message: "UPI ID, Trx and image Updated Successfully",
        imageUrl: upiID.imageUrl
      });
    } else {
      // UPI ID does not exist, create it
      const newUpiID = new UPIAddress({
        Upi,
        Trx,
        user: req.user._id,
        imageUrl
      });
      await newUpiID.save();
      res.status(200).json({
        success: true,
        message: "UPI ID, Trx and image Added Successfully",
        imageUrl: newUpiID.imageUrl
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

router.get('/Getid', auth, async (req, res) => {
  try {
    // Find the UPI details for the user
    const upiDetails = await UPIAddress.findOne().select('Upi Trx imageUrl').exec();

    if (!upiDetails) {
      return res.status(400).json({
        success: false,
        message: "No UPI details found for the user"
      });
    }

    res.status(200).json({
      success: true,
      message: "Here are the UPI details",
      Upi: upiDetails.Upi,
      Trx: upiDetails.Trx,
      imageUrl: upiDetails.imageUrl
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

  

module.exports = router;