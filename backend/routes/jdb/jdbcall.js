const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { v4: uuidv4 } = require("uuid");
const axios = require('axios');
const auth = require("../../middlewares/auth");
const User = require("../../models/userModel");
require("dotenv").config();

const API_KEY = process.env.API_KEY_JDB; // Replace with your API Key
const API_SECRET = process.env.API_SECRET_JDB; // Replace with your API Secret


// Function to create MD5 signature
function generateSignature(requestBody) {
    const hmac = crypto.createHmac("sha256", API_SECRET);
    hmac.update(JSON.stringify(requestBody));
    return hmac.digest("hex");
}



// Function to handle deposit
async function handleDeposit(username, transferAmount, currency = "INR") {
    console.log(username, transferAmount);
    if (!username || !transferAmount) {
        throw new Error("Missing required parameters");
    }

    const traceId = uuidv4();
    const referenceId = uuidv4();

    const requestBody = {
        username,
        traceId,
        transferAmount,
        currency,
        referenceId,
    };

    const signature = generateSignature(requestBody);

    try {
        const response = await axios.post("https://stg.gasea168.com/cash/deposit", requestBody, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
                "X-Signature": signature,
            },
        });
console.log("data here ->",response);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Deposit API Error: ${response.data}`);
        }
    } catch (error) {
        console.error("Error calling Deposit API:", error);
        throw new Error("Internal Server Error");
    }
}

router.post("/game/launch/jdb", auth, async(req, res) => {
    const { gameCode } = req.body;
    const language = "en";
    const platform = "web";
    const currency = "INR"; // Default currency
    const lobbyUrl = "https://default.lobby.url"; // Default lobby URL
    const ipAddress = req.ip || "127.0.0.1"; // Default IP address

    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById(userId);
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

    const username = user.username;
    const transferAmount = user.walletAmount;
    console.log(username);
    console.log(transferAmount);

    if (!username || !gameCode) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    // Generate unique traceId
    const traceId = uuidv4();

    if (transferAmount > 0) {
        try {
            const result = await handleDeposit(username, transferAmount);
            console.log(result);
            if (result && result.status === 'SC_OK') {
                user.walletAmount = 0;
                await user.save();
            } else {
                return res.status(500).json({ error: "Deposit failed" });
            }
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }

    // Prepare request body for Game Aggregator API
    const requestBody = {
        username,
        traceId,
        gameCode,
        language,
        platform,
        currency,
        lobbyUrl,
        ipAddress,
    };

    // Generate X-Signature
    const signature = generateSignature(requestBody);

    try {
        // Call Game Aggregator API
        const response = await axios.post("https://stg.gasea168.com/game/url", requestBody, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
                "X-Signature": signature,
            },
        });

        if (response.status === 200) {
            // Success - return the game URL to the client
            return res.status(200).json(response.data);
        } else {
            // Error from Game Aggregator
            return res.status(response.status).json({
                error: "Game Aggregator API Error",
                details: response.data,
            });
        }
    } catch (error) {
        console.error("Error calling Game Aggregator API:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});



// Function to check player's balance
async function checkPlayerBalance(username) {
    const currency = "INR"; // Default currency

    if (!username || !currency) {
        throw new Error("Missing required parameters");
    }

    const traceId = uuidv4();

    const requestBody = {
        username,
        traceId,
        currency,
    };

    const signature = generateSignature(requestBody);

    try {
        const response = await axios.post("https://stg.gasea168.com/cash/balance", requestBody, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
                "X-Signature": signature,
            },
        });
        console.log(response);
        if (response.status === 200) {
            return response.data.data.amount;
        } else {
            throw new Error(`Balance API Error: ${response.data}`);
        }
    } catch (error) {
        console.error("Error calling Balance API:", error);
        throw new Error("Internal Server Error");
    }
}


// Route to check player's balance
router.get("/cash/balance",auth, async (req, res) => {
    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById(userId);
    const currency = "INR"; // Default currency
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

    const username = user.username;



    if (!username || !currency) {
        return res.status(400).json({ error: "Missing required parameters" });
    }

    const traceId = uuidv4();

    const requestBody = {
        username,
        traceId,
        currency,
    };

    const signature = generateSignature(requestBody);

    try {
        const response = await axios.post("https://stg.gasea168.com/cash/balance", requestBody, {
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_KEY,
                "X-Signature": signature,
            },
        });

        if (response.status === 200) {
            res.status(200).json(response.data);
        } else {
            res.status(response.status).json({
                error: "Balance API Error",
                details: response.data,
            });
        }
    } catch (error) {
        console.error("Error calling Balance API:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


// Route to withdraw from a player's wallet
router.post("/cash/withdraw", auth, async (req, res) => {
    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById(userId);
    const currency = "INR"; // Default currency
    if (!user) {
        return res.status(404).json({ success: '0', message: 'User not found' });
    }
    const username = user.username;

    try {
        const playerBalance = await checkPlayerBalance(username);
        console.log(playerBalance);
        if (playerBalance > 0) {
            const traceId = uuidv4();
            const referenceId = uuidv4();

            const requestBody = {
                username,
                traceId,
                transferAmount: playerBalance,
                currency,
                referenceId,
            };

            const signature = generateSignature(requestBody);

            const response = await axios.post("https://stg.gasea168.com/cash/withdraw", requestBody, {
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_KEY,
                    "X-Signature": signature,
                },
            });

            if (response.status === 200) {
                user.walletAmount += playerBalance;
                await user.save();
                return res.status(200).json(response.data);
            } else {
                return res.status(response.status).json({
                    error: "Withdraw API Error",
                    details: response.data,
                });
            }
        } else {
            return res.status(400).json({ error: "Insufficient balance" });
        }
    } catch (error) {
        console.error("Error processing withdrawal:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});


// Registration Route
// router.post('/topbetgaming-register', async (req, res) => {
//   const { username, org, ip } = req.body;

//   // Prepare parameters
//   const params = {
//     pid: PID,
//     ver: VERSION,
//     method: 'REGISTER',
//     username,
//     org,
//     ip
//   };

//   // Generate the signature
//   params.sign = createSignature(params);

//   try {
//     // Send the request to the API
//     const response = await axios.post(API_URL, params);
//     res.json(response.data);  // Send back the API response to the client
//   } catch (error) {
//     res.status(500).json({ error: 'Registration failed', details: error.message });
//   }
// });





// const generateTransactionId = () => {
//     // Get current timestamp in milliseconds
//     const timestamp = Date.now().toString();
  
//     // Generate a random number to add uniqueness
//     const randomNum = Math.floor(Math.random() * 100000).toString();
  
//     // Combine them to create a unique transaction ID
//     const transactionId = `TXN${timestamp}${randomNum}`;
  
//     return transactionId;
//   };



//   async function handleDeposit(username, balance) {
//     // Prepare parameters
//     const params = {
//       pid: PID,
//       ver: VERSION,
//       method: 'DEPOSIT',
//       username,
//       orderid: generateTransactionId(), // Assuming generateOrderId is a function that generates a unique order ID
//       amount: balance
//     };
  
//     // Generate the signature
//     params.sign = createSignature(params);
  
//     try {
//       // Send the request to the API
//       const response = await axios.post(API_URL, params);
//       return response.data;  // Return the API response
//     } catch (error) {
//       throw new Error(`Deposit failed: ${error.message}`);
//     }
//   }

// Login Route
// router.post('/topbetgaming-login', auth, async (req, res) => {
//     const userId = req.user._id; // Authenticated user's ID from token
//     const user = await User.findById (userId);
//     if (!user) { 
//         return res.status(404).json({ success: '0', message: 'User not found' });
//     }

//      username = user.username;
//      player_balance = user.walletAmount;
//      ip = "192.168.1.168";
//      lang = 'en'
//      const {app_id } = req.body;

//      if (player_balance > 0) {
//         handleDeposit(username, player_balance);
//         user.walletAmount -= player_balance;
//         await user.save();
//       }

//   // Prepare parameters
//   const params = {
//     pid: PID,
//     ver: VERSION,
//     method: 'LOGIN',
//     username,
//     app_id,
//     ip,
//     lang
//   };

//   // Generate the signature
//   params.sign = createSignature(params);

//   try {
//     // Send the request to the API
//     const response = await axios.post(API_URL, params);
//     res.json(response.data);  // Send back the API response to the client
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed', details: error.message });
//   }
// });


// async function getBalance(username) {
//     // Prepare parameters
//     const params = {
//       pid: PID,
//       ver: VERSION,
//       method: 'BALANCE',
//       username
//     };
  
//     // Generate the signature
//     params.sign = createSignature(params);
  
//     try {
//       // Send the request to the API
//       const response = await axios.post(API_URL, params);
//       return response.data;  // Return the API response
//     } catch (error) {
//       throw new Error(`Balance inquiry failed: ${error.message}`);
//     }
//   }

// Withdrawal Route
// router.post('/topbetgaming-withdraw',auth, async (req, res) => {

//     const userId = req.user._id; // Authenticated user's ID from token
//     const user = await User.findById (userId);
//     if (!user) { 
//         return res.status(404).json({ success: '0', message: 'User not found' });
//     }

//      username = user.username;
//      orderid = generateTransactionId().toString();

   
//           const { balance } = await getBalance(username);
//           console.log(balance);
       
//            amount = balance;

//   // Ensure amount is a number
//   const parsedAmount = parseFloat(amount);
//   if (isNaN(parsedAmount)) {
//     return res.status(400).json({ error: 'Invalid amount' });
//   }

//   // Prepare parameters
//   const params = {
//     pid: PID,
//     ver: VERSION,
//     method: 'WITHDRAW',
//     username: String(username),
//     orderid: String(orderid),
//     amount // Ensure amount is formatted as a string with 2 decimal places
//   };

//   // Generate the signature
//   params.sign = createSignature(params);

//   // Log the parameters for debugging
//   console.log('Parameters sent to API:', params);

//   try {
//     // Send the request to the API
//     const response = await axios.post(API_URL, params);
//     if (response.data.code === 0) {
      
//           user.walletAmount += params.amount;
//           await user.save();
//     }
//     res.json(response.data);  // Send back the API response to the client
  
//   } catch (error) {
//     console.error('API request failed:', error.response ? error.response.data : error.message);
//     res.status(500).json({ error: 'Withdrawal failed', details: error.message });
//   }
// });
// Balance Inquiry Route


// router.post('/topbetgaming-balance', auth,  async (req, res) => {

//     const userId = req.user._id; // Authenticated user's ID from token
//     const user = await User.findById (userId);
//     if (!user) { 
//         return res.status(404).json({ success: '0', message: 'User not found' });
//     }

//      username = user.username;
  

//   // Prepare parameters
//   const params = {
//     pid: PID,
//     ver: VERSION,
//     method: 'BALANCE',
//     username
//   };

//   // Generate the signature
//   params.sign = createSignature(params);

//   try {
//     // Send the request to the API
//     const response = await axios.post(API_URL, params);
//     res.json(response.data);  // Send back the API response to the client
//   } catch (error) {
//     res.status(500).json({ error: 'Balance inquiry failed', details: error.message });
//   }
// });


// Export the router
module.exports = router;