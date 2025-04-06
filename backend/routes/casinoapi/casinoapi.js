const express = require('express');
const axios = require('axios');
const CryptoJS = require('crypto-js');
const router = express.Router();
require("dotenv").config();

// AES Encryption function
function encryptPayload(data, key) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key); // Parse key to UTF-8 format
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), keyUtf8, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString(); // Return Base64 encrypted string
}

// AES Decryption function (if needed for response handling)
function decryptPayload(encryptedData, key) {
    const keyUtf8 = CryptoJS.enc.Utf8.parse(key); // Parse key to UTF-8 format
    const decrypted = CryptoJS.AES.decrypt(encryptedData, keyUtf8, {    
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return JSON.parse(decrypted.toString(CryptoJS.enc.Utf8)); // Return decrypted JSON object
}

// API route
router.post('/casinoapi-request-game-url', async (req, res) => {
    const { game_uid } = req.body;

    const timestamp = Math.floor(Date.now() / 1000); // Get current timestamp

    if (!game_uid) {
        return res.status(400).json({ error: "Missing required field: game_uid" });
    }

    // Define the default payload data
    const payloadData = {
        agency_uid: "05fa28be176ca6a3934ea971f6085062",
        member_account: "player01",
        game_uid,
        timestamp,
        credit_amount: "50",
        currency_code: "BRL",
        language: "en",
        home_url: "http://example.com",
        platform: 1,
        callback_url: "http://callback.com"
    };

    // Encrypt the payload
    const AES_KEY = process.env.AES_KEY_CASINO; // Replace with your AES key
    const encryptedPayload = encryptPayload(payloadData, AES_KEY);

    // Prepare the request body with encrypted payload
    const apiRequestBody = {
        agency_uid: payloadData.agency_uid,
        timestamp,
        payload: encryptedPayload
    };

    try {
        // Send POST request to the external API
        const response = await axios.post('https://jsgame.live/game/v1', apiRequestBody);
        res.json(response.data);
    } catch (error) {
        console.error("API Error:", error.message);
        res.status(500).json({ error: "Failed to retrieve game URL" });
    }
});

module.exports = router;