const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const TransactionHistory = require("../../models/TransictionHistory");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const axios = require("axios");
const UidSequence = require("../../models/uidSequenceModel");
const IpTrack = require("../../models/ipTrackModel");
const ipLogModel = require("../../models/ipLogModel");

const BASE_URL = process.env.GLOBAL_API_URL;
const CLIENT_ID = process.env.GLOBAL_API_CLIENT_ID;
const CLIENT_SECRET = process.env.GLOBAL_API_CLIENT_SECRET;

// Auth token management
let authToken = null;
let tokenExpiration = 0;

// Add this function before the routes
async function validateIPAddress(req) {
  const ip = req.ip || req.connection.remoteAddress;

  const existingIP = await IpTrack.findOne({ ipAddress: ip });
  if (existingIP) {
    return false;
  }

  await new IpTrack({ ipAddress: ip }).save();
  return true;
}

async function generateUID() {
  const uidSequence = await UidSequence.findOneAndUpdate(
    {},
    { $inc: { currentUid: 1 } },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );
  return uidSequence.currentUid + 20000;
}

async function generateUniqueUsername(retries = 0, maxRetries = 5) {
  if (retries >= maxRetries) {
    throw new Error("Failed to generate unique username after max retries");
  }

  const randomNumbers = Math.floor(Math.random() * 10000);
  const randomAlphabets = Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase();
  const username = `MEMBER${randomNumbers}${randomAlphabets}`;

  // Check if username exists
  const existingUser = await User.findOne({ username });
  if (existingUser) {
    return generateUniqueUsername(retries + 1, maxRetries);
  }

  return username;
}

async function generateInviteCode(uid) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let randomPrefix = "";
  // Generate 4 random letters
  for (let i = 0; i < 4; i++) {
    randomPrefix += letters.charAt(Math.floor(Math.random() * letters.length));
  }
  // Combine prefix with UID
  return `${randomPrefix}${uid}`;
}

function generateReferralLink(req, invitationCode) {
  let baseUrl = "https://747lottery.live";
  return `${baseUrl}/register?invitecode=${invitationCode}`;
}

function generateProfilePicture(req) {
  const randomNumber = Math.floor(Math.random() * 13) + 1;
  let baseUrl = req.protocol + "://" + req.get("host");
  return `${baseUrl}/assets/profile-${randomNumber}.png`;
}

async function getAuthToken(forceRefresh = false) {
  try {
    if (!forceRefresh && authToken && Date.now() < tokenExpiration) {
      return authToken;
    }

    const response = await axios.post(
      `${BASE_URL}/auth/createtoken`,
      {
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
      },
      {
        timeout: 10000,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }
    );

    if (!response.data || !response.data.token) {
      throw new Error("Invalid token response format");
    }

    authToken = response.data.token;
    tokenExpiration = Date.now() + (response.data.expiration || 3600) * 1000;

    return authToken;
  } catch (error) {
    const errorMessage = {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    };
    throw new Error(`Authentication failed: ${error.message}`);
  }
}

const jilirealregister = async (data) => {
  // Define the test user data
  const testUserData = {
    Account: data,
  };

  // Define the API endpoint URL (change the port if necessary)
  const url = `${process.env.DOMAIN}/jilireal-create-member`; // Update with your actual endpoint

  try {
    // Make the POST request
    const response = await axios.post(url, testUserData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the response
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("Error during the request:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
};

const topbetgamingregister = async (data) => {
  // Define the test user data
  const testUserData = {
    username: data,
    org: 1,
    ip: "192.168.1.168",
  };

  // Define the API endpoint URL (change the port if necessary)
  const url = `${process.env.DOMAIN}/topbetgaming-register`; // Update with your actual endpoint

  try {
    // Make the POST request
    const response = await axios.post(url, testUserData, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Log the response
    console.log("Response data:", response.data);
  } catch (error) {
    console.error("Error during the request:", error.message);
    if (error.response) {
      console.error("Response data:", error.response.data);
    }
  }
};

async function createUser(userCode) {
  if (!userCode) {
    throw new Error("userCode is required");
  }

  const token = await getAuthToken();
  const response = await axios.post(
    `${BASE_URL}/user/create`,
    { userCode },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
}

router.post("/fuckyou", async (req, res) => {
  try {
    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const isIpRegistered = await ipLogModel.findOne({ ipAddress });
    if (isIpRegistered) {
      return res.status(400).json({ msg: "IP address already registered" });
    }
    const { mobile, password, invitecode, noidaOffice } = req.body;

    accountType = noidaOffice || "Normal";

    if (!mobile || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    let referrer = null;
    if (invitecode) {
      referrer = await User.findOne({ invitationCode: invitecode });
      if (!referrer) {
        return res.status(400).json({ msg: "Invalid invite code" });
      }
    }

    const username = await generateUniqueUsername();
    const encryptedPassword = await bcrypt.hash(password, 10);
    const uid = await generateUID();
    const invitationCode = await generateInviteCode(uid);
    const user = new User({
      mobile,
      password: encryptedPassword,
      plainPassword: password,
      invitecode,
      username: username,
      invitationCode,
      uid: uid,
      accountType,
      referralLink: generateReferralLink(req, invitationCode),
      avatar: generateProfilePicture(req),
      referrer: referrer ? referrer._id : null,
      walletAmount: 25, // Add the one-time registration bonus
    });

    await user.save();

    jilirealregister(username);
    topbetgamingregister(username);
    // createUser(username);

    // Add transaction record for sign-up bonus
    await addTransactionDetails(
      user._id,
      25,
      "Sign Up Bonus",
      new Date(),
      0, // depositAmount
      0, // betAmount
      "N/A", // gameType
      null, // commissionFromUser
      0, // depositAmountOfUser
      0, // commissionLevel
      "notDepositYet" // firstDepositChecker
    );

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 10,
    });
    user.token = token;
    user.password = undefined;

    if (referrer) {
      let currentReferrer = referrer;
      let level = 1;
      const today = new Date();
      today.toLocaleDateString("en-IN");

      while (currentReferrer && level <= 5) {
        const referredUserData = {
          mobile,
          uid: user.uid,
          date: today,
          level,
        };

        currentReferrer.referredUsers.push(referredUserData);

        await currentReferrer.save();
        currentReferrer = await User.findById(currentReferrer.referrer);
        level++;
      }
    }

    if (referrer) {
      let currentReferrer = referrer;
      let level = 1;
      const today = new Date();
      today.toLocaleDateString("en-IN");

      while (currentReferrer && level <= 5) {
        const subordinateData = {
          date: today,
          noOfRegister: 1,
          depositNumber: 0,
          depositAmount: 0,
          firstDeposit: 0,
          level: level,
        };

        if (level === 1) {
          const existingDirectSubordinate =
            currentReferrer.directSubordinates.find(
              (sub) => sub.date.getTime() === today.getTime()
            );

          if (existingDirectSubordinate) {
            existingDirectSubordinate.noOfRegister++;
          } else {
            currentReferrer.directSubordinates.push(subordinateData);
          }
        } else {
          const existingTeamSubordinate = currentReferrer.teamSubordinates.find(
            (sub) => sub.date.getTime() === today.getTime()
          );

          if (existingTeamSubordinate) {
            existingTeamSubordinate.noOfRegister++;
          } else {
            currentReferrer.teamSubordinates.push(subordinateData);
          }
        }

        await currentReferrer.save();
        currentReferrer = await User.findById(currentReferrer.referrer);
        level++;
      }
    }

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// POST: Register Role-Specific User
router.post("/type/fuckyou", auth, isAdmin, async (req, res) => {
  try {
    const { mobile, password, invitecode, noidaOffice } = req.body;

    const accountType = noidaOffice;

    // Validate inputs
    if (!mobile || !password || !accountType) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Allowed roles
    const allowedRoles = [
      "FinanceHead",
      "GameHead",
      "SettingsHead",
      "AdditionalHead",
      "SupportHead",
    ];

    // Check for valid account type
    if (!allowedRoles.includes(accountType)) {
      return res.status(400).json({ msg: "Invalid role provided" });
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User already exists with this mobile" });
    }

    // Handle referrer invite code logic
    let referrer = null;
    if (invitecode) {
      referrer = await User.findOne({ invitationCode: invitecode });
      if (!referrer) {
        return res.status(400).json({ msg: "Invalid invite code" });
      }
    }

    // Hash password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const uid = await generateUID();
    // Generate additional fields
    const invitationCode = generateInviteCode();
    const username = await generateUniqueUsername();
    const newUser = new User({
      mobile,
      password: encryptedPassword,
      plainPassword: password,
      invitecode,
      username: username,
      invitationCode,
      uid: uid,
      accountType,
      referralLink: generateReferralLink(req, invitationCode),
      avatar: generateProfilePicture(req),
      referrer: referrer ? referrer._id : null,
      walletAmount: 58, // One-time registration bonus
    });

    // Save new user to the database
    await newUser.save();
    jilirealregister(username);
    topbetgamingregister(username);
    // Add transaction record for sign-up bonus
    await addTransactionDetails(
      newUser._id,
      58,
      "Sign Up Bonus",
      new Date(), // Correctly pass Date object
      0, // depositAmount
      0, // betAmount
      "N/A", // gameType
      null, // commissionFromUser
      0, // depositAmountOfUser
      0, // commissionLevel
      "notDepositYet" // firstDepositChecker
    );

    // Create JWT token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 10,
    });

    newUser.token = token;
    newUser.password = undefined;

    // Handle referral chain and subordinate updates
    if (referrer) {
      let currentReferrer = referrer;
      let level = 1;
      const today = new Date(); // Use Date object directly

      // Update referrer tree up to 5 levels
      while (currentReferrer && level <= 5) {
        const referredUserData = {
          mobile: newUser.mobile,
          uid: newUser.uid,
          date: today, // Assign Date object
          level,
        };

        currentReferrer.referredUsers.push(referredUserData);
        await currentReferrer.save();

        currentReferrer = await User.findById(currentReferrer.referrer);
        level++;
      }

      // Update subordinates
      currentReferrer = referrer;
      level = 1;
      while (currentReferrer && level <= 5) {
        const subordinateData = {
          date: today, // Assign Date object
          noOfRegister: 1,
          depositNumber: 0,
          depositAmount: 0,
          firstDeposit: 0,
          level: level,
        };

        if (level === 1) {
          const existingDirectSubordinate =
            currentReferrer.directSubordinates.find(
              (sub) => sub.date.getTime() === today.getTime()
            );

          if (existingDirectSubordinate) {
            existingDirectSubordinate.noOfRegister++;
          } else {
            currentReferrer.directSubordinates.push(subordinateData);
          }
        } else {
          const existingTeamSubordinate = currentReferrer.teamSubordinates.find(
            (sub) => sub.date.getTime() === today.getTime()
          );

          if (existingTeamSubordinate) {
            existingTeamSubordinate.noOfRegister++;
          } else {
            currentReferrer.teamSubordinates.push(subordinateData);
          }
        }

        await currentReferrer.save();
        currentReferrer = await User.findById(currentReferrer.referrer);
        level++;
      }
    }

    res.status(200).json({
      success: true,
      token,
      user: {
        _id: newUser._id,
        mobile: newUser.mobile,
        invitationCode: newUser.invitationCode,
        username: newUser.username,
        uid: newUser.uid,
        referralLink: newUser.referralLink,
        walletAmount: newUser.walletAmount,
        accountType: newUser.accountType,
        avatar: newUser.avatar,
        firstDepositMade: newUser.firstDepositMade,
        remainingWithdrawAmount: newUser.remainingWithdrawAmount,
        // Include other necessary fields as needed
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Dummy user registration route for admin use
router.post("/registerdummyuser", auth, isAdmin, async (req, res) => {
  try {
    const { mobile, password } = req.body;

    // Check for required fields
    if (!mobile || !password) {
      return res
        .status(400)
        .json({ msg: "Mobile number and password are required" });
    }

    // Check if a user with this mobile already exists
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res
        .status(400)
        .json({ msg: "User with this mobile number already exists" });
    }

    // Encrypt the password
    const encryptedPassword = await bcrypt.hash(password, 10);
    const username = await generateUniqueUsername();
    const uid = await generateUID();
    // Create the dummy user with accountType set to "Restricted"
    const user = new User({
      mobile,
      password: encryptedPassword,
      plainPassword: password,
      invitecode: null, // No invite code for dummy user
      username: username,
      invitationCode: null, // No invitation code for dummy user
      uid: uid,
      accountType: "Restricted", // Setting the account type as Restricted
      referralLink: null, // No referral link for dummy user
      avatar: generateProfilePicture(req),
      referrer: null, // No referrer for dummy user
      walletAmount: 58, // No wallet amount for dummy user
    });

    // Save the dummy user
    await user.save();
    jilirealregister(username);
    topbetgamingregister(username);
    // Add transaction record for sign-up bonus
    await addTransactionDetails(
      user._id,
      58,
      "Sign Up Bonus",
      new Date(),
      0, // depositAmount
      0, // betAmount
      "N/A", // gameType
      null, // commissionFromUser
      0, // depositAmountOfUser
      0, // commissionLevel
      "notDepositYet" // firstDepositChecker
    );

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: 3600 * 10,
    });

    user.token = token;
    user.password = undefined;

    res.status(200).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Route for getting all dummy users
router.get("/dummyusers", auth, isAdmin, async (req, res) => {
  try {
    // Fetch all users with accountType 'Restricted'
    const dummyUsers = await User.find({ accountType: "Restricted" });

    // Check if there are no dummy users
    if (dummyUsers.length === 0) {
      return res.status(404).json({ message: "No dummy users found." });
    }

    res.status(200).json({
      success: true,
      dummyUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

// Route for getting all users excluding 'Admin', 'Normal', and 'Restricted' account types
router.get("/filteredusers", auth, isAdmin, async (req, res) => {
  try {
    // Fetch users with accountType not equal to 'Admin', 'Normal', or 'Restricted'
    const filteredUsers = await User.find({
      accountType: { $nin: ["Admin", "Normal", "Restricted"] },
    });

    // Check if no filtered users are found
    if (filteredUsers.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found with the specified account types." });
    }

    res.status(200).json({
      success: true,
      filteredUsers,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

module.exports = router;
