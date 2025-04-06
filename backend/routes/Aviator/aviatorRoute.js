const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../../models/userModel"); // Adjust the path as necessary
const axios = require("axios");
const auth = require("../../middlewares/auth");

router.post("/redirect-to-second-website", auth, async (req, res) => {
    console.log("first")
    const userId = req.user._id;
    const token = req.cookies.token;

    if (!userId || !token) {
        return res.status(400).json({ error: "Missing userId or token" });
    }

    try {
        // Check if user exists on the second website
        const checkUserUrl = `https://newgoagames.anotechsolutions.site/api/users/check/${userId}`;
        let userExists;

        try {
            const userExistsResponse = await axios.get(checkUserUrl);
            userExists = userExistsResponse.data.exists;
        } catch (error) {
            if (error.response && error.response.status === 404) {
                userExists = false;
            } else {
                console.error("Error checking user existence:", error);
                return res.status(500).json({ error: "Error checking user existence" });
            }
        }

        if (!userExists) {
            // Fetch user details from the local database
            const userDetails = await User.findById(userId).exec();

            if (!userDetails) {
                return res.status(404).json({ error: "User not found" });
            }

            // Prepare user data for registration
            const userRegistrationData = {
                fullName: userDetails.mobile,
                email: userDetails.mobile,
                username: userDetails.mobile,
                password: userDetails.mobile, // Ensure the password is properly hashed or handle it appropriately
                role: "user",
                firstWebsiteUserId: userDetails._id, // Pass the first website user ID
                token,
            };

            // Register the user on the second website
            const registerUrl = "https://newgoagames.anotechsolutions.site/api/users/register";
            const registerResponse = await axios.post(
                registerUrl,
                userRegistrationData,
                { withCredentials: true }
            );

            if (registerResponse.status !== 201) {
                return res.status(registerResponse.status).json(registerResponse.data);
            }
        }

        // If user exists or registration is successful, attempt to login
        const loginUrl = "https://newgoagames.anotechsolutions.site/api/users/login";
        const loginResponse = await axios.post(
            loginUrl,
            { userId, token },
            { withCredentials: true }
        );

        console.log("loginResponse--->",loginResponse)

        if (loginResponse.status === 200) {
            const { accessToken, refreshToken, userIdentifier } = loginResponse.data;

            // Redirect to the second website's /set-tokens route with tokens in query params
            const redirectUrl = `https://newgoagames.anotechsolutions.site/set-tokens?accessToken=${accessToken}&refreshToken=${refreshToken}&userIdentifier=${userIdentifier}`;
            return res.json({ redirectUrl });
        }

        return res.status(loginResponse.status).json(loginResponse.data);

    } catch (error) {
        console.error("Error processing request:", error);
        return res.status(500).json({ error: "Internal server error", details: error.message });
    }
});

module.exports = router;
