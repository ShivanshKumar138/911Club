const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
const auth = require("../../middlewares/auth");
const User = require("../../models/userModel");
const {addTransactionDetails} = require('../../controllers/TransactionHistoryControllers')

require("dotenv").config();

const API_URL = process.env.API_URL;
const PID = process.env.PID;  // Replace with your actual Merchant ID
const API_SECRET = process.env.API_SECRET;  // Replace with your actual API secret
const VERSION = process.env.VERSION;


// Function to create MD5 signature
const createSignature = (params) => {
  // Sort parameters by ASCII order of keys and concatenate into `key=value&` format
  const sortedParams = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  
  // Append API_SECRET to the string
  const stringToSign = `${sortedParams}&apikey=${API_SECRET}`;
  
  // Return the MD5 hash of the final string
  return crypto.createHash('md5').update(stringToSign).digest('hex').toUpperCase();
};

// Registration Route
router.post('/topbetgaming-register', async (req, res) => {
  const { username, org, ip } = req.body;

  // Prepare parameters
  const params = {
    pid: PID,
    ver: VERSION,
    method: 'REGISTER',
    username,
    org,
    ip
  };

  // Generate the signature
  params.sign = createSignature(params);

  try {
    // Send the request to the API
    const response = await axios.post(API_URL, params);
    res.json(response.data);  // Send back the API response to the client
  } catch (error) {
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});





const generateTransactionId = () => {
    // Get current timestamp in milliseconds
    const timestamp = Date.now().toString();
  
    // Generate a random number to add uniqueness
    const randomNum = Math.floor(Math.random() * 100000).toString();
  
    // Combine them to create a unique transaction ID
    const transactionId = `TXN${timestamp}${randomNum}`;
  
    return transactionId;
  };

  let depositHandled = false;

  async function handleDeposit(user, balance) {
      if (depositHandled || balance <= 0) return; // Exit if the function has already been called or balance is not greater than 0
  
      depositHandled = true; // Set the flag to true to indicate the function has been called
  
      // Prepare parameters
      const params = {
          pid: PID,
          ver: VERSION,
          method: 'DEPOSIT',
          username: user.username,
          orderid: generateTransactionId(), // Assuming generateOrderId is a function that generates a unique order ID
          amount: balance
      };
  
      // Generate the signature
      params.sign = createSignature(params);
  
      try {
          // Send the request to the API
          const response = await axios.post(API_URL, params);
  
          // Deduct the balance from the user's wallet only if the deposit is successful
          user.walletAmount -= balance;
          await user.save();

          await addTransactionDetails(user._id, balance, "Game Moved Out", new Date());
  
          return response.data;  // Return the API response
      } catch (error) {
          throw new Error(`Deposit failed: ${error.message}`);
      } finally {
          depositHandled = false; // Reset the flag after the function completes
      }
  }
  


  // Login Route
  router.post('/topbetgaming-login', auth, async (req, res) => {
      const userId = req.user._id; // Authenticated user's ID from token
      const user = await User.findById(userId);
      if (!user) { 
          return res.status(404).json({ success: '0', message: 'User not found' });
      }
  
      username = user.username;
      player_balance = user.walletAmount-user.holdAmount;
      ip = "192.168.1.168";
      lang = 'en';
      const { app_id } = req.body;
  
      if (player_balance > 0) {
          try {
              await handleDeposit(user, player_balance);
          } catch (error) {
              return res.status(500).json({ error: 'Deposit failed', details: error.message });
          }
      }
  
      // Prepare parameters
      const params = {
          pid: PID,
          ver: VERSION,
          method: 'LOGIN',
          username,
          app_id,
          ip,
          lang
      };
  
      // Generate the signature
      params.sign = createSignature(params);
  
      try {
          // Send the request to the API
          const response = await axios.post(API_URL, params);
          res.json(response.data);  // Send back the API response to the client
      } catch (error) {
          res.status(500).json({ error: 'Login failed', details: error.message });
      }
  });


  
async function getBalance(username) {
    // Prepare parameters
    const params = {
      pid: PID,
      ver: VERSION,
      method: 'BALANCE',
      username
    };
  
    // Generate the signature
    params.sign = createSignature(params);
  
    try {
      // Send the request to the API
      const response = await axios.post(API_URL, params);
      return response.data;  // Return the API response
    } catch (error) {
      throw new Error(`Balance inquiry failed: ${error.message}`);
    }
  }


  
// Withdrawal Route
router.post('/topbetgaming-withdraw',auth, async (req, res) => {

    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById (userId);
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

     username = user.username;
     orderid = generateTransactionId().toString();

   
          const { balance } = await getBalance(username);
          console.log(balance);
       
           amount = balance;

  // Ensure amount is a number
  const parsedAmount = parseFloat(amount);
  if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid amount' });
  }

  // Prepare parameters
  const params = {
    pid: PID,
    ver: VERSION,
    method: 'WITHDRAW',
    username: String(username),
    orderid: String(orderid),
    amount // Ensure amount is formatted as a string with 2 decimal places
  };

  // Generate the signature
  params.sign = createSignature(params);

  // Log the parameters for debugging
  console.log('Parameters sent to API:', params);

  try {
    // Send the request to the API
    const response = await axios.post(API_URL, params);
    if (response.data.code === 0) {
      
          user.walletAmount += params.amount;
          await user.save();
          await addTransactionDetails(user._id, params.amount, "Game Moved In", new Date());
    }
    res.json(response.data);  // Send back the API response to the client
  
  } catch (error) {
    console.error('API request failed:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Withdrawal failed', details: error.message });
  }
});
// Balance Inquiry Route


router.post('/topbetgaming-balance', auth,  async (req, res) => {

    const userId = req.user._id; // Authenticated user's ID from token
    const user = await User.findById (userId);
    if (!user) { 
        return res.status(404).json({ success: '0', message: 'User not found' });
    }

     username = user.username;
  

  // Prepare parameters
  const params = {
    pid: PID,
    ver: VERSION,
    method: 'BALANCE',
    username
  };

  // Generate the signature
  params.sign = createSignature(params);

  try {
    // Send the request to the API
    const response = await axios.post(API_URL, params);
    res.json(response.data);  // Send back the API response to the client
  } catch (error) {
    res.status(500).json({ error: 'Balance inquiry failed', details: error.message });
  }
});


// Export the router
module.exports = router;