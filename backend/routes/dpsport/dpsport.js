const express = require("express");
const crypto = require("crypto");
const axios = require("axios");
const router = express.Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/userModel");
const moment = require('moment-timezone');
require("dotenv").config();


const secretKey = process.env.DPSPORT; // Replace with your actual secret key
const tenantCode = process.env.TENANTCODE; // Replace with your actual tenant code
const tenantKey = process.env.TENANTKEY; // Replace with your actual tenant key



// Helper function for AES encryption
function encrypt(data, key) {
    const cipher = crypto.createCipheriv("aes-256-ecb", Buffer.from(key, "utf-8"), null);
    cipher.setAutoPadding(true); // Ensure PKCS5 padding
    let encrypted = cipher.update(JSON.stringify(data), "utf8", "base64");
    encrypted += cipher.final("base64");
    return encrypted;
}

function generateRandomNickname(length = 8) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let nickname = '';
    for (let i = 0; i < length; i++) {
        nickname += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return nickname;
}
// Helper function for MD5 hashing
function md5(content, key) {
    const hash = crypto.createHash('md5');
    hash.update(content + key, 'utf8');
    return hash.digest('hex').toUpperCase();
}

// Register route
router.post("/dpsport-register", auth ,  async (req, res) => {

    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById (userId);
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

    userName = user.username;
    const nickName = generateRandomNickname(); 

    
    const timestamp = Date.now();
    const currency = 1;

    // Encrypt the user information
    const encryptedData = encrypt({ userName, nickName, tenantCode , currency}, tenantKey);

    // Concatenate the string for MD5 hashing
    const content = `${timestamp}|${tenantCode}|${encryptedData}`;
    const sign = md5(content, tenantKey);

    // Prepare the request payload
    const payload = {
        data: encryptedData,
        sign: sign,
        tenantCode: tenantCode,
        timestamp: timestamp,

    };

    try {
        // Send request to external API
        const apiResponse = await axios.post("https://api.yxhnz7.com/api/user/register", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        res.json(apiResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login route
router.post("/dpsport-auth",auth, async (req, res) => {
    
    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById (userId);
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

    userName = user.username;
    console.log(userName);
   
    const tenantKey = "8c026e6794d16254eefbf1e0c849e628"; // Ensure this is 32 bytes long
    const timestamp = Date.now();

    // Encrypt the login data
    const encryptedData = encrypt({ userName, tenantCode }, tenantKey);

    // Concatenate the string for MD5 hashing
    const content = `${timestamp}|${tenantCode}|${encryptedData}`;
    const sign = md5(content, tenantKey);

    // Prepare the request payload
    const payload = {
        data: encryptedData,
        sign: sign,
        tenantCode: tenantCode,
        timestamp: timestamp
    };

    try {
        // Send request to external API
        const apiResponse = await axios.post("https://api.yxhnz7.com/api/user/auth", payload, {
            headers: {
                "Content-Type": "application/json"
            }
        });

        res.json(apiResponse.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;