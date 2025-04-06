// utils.js
const crypto = require('crypto');
const axios = require('axios');  // Using axios for HTTP requests

// Function to sign parameters
function paramArraySign(paramArray, mchKey) {
  const sortedKeys = Object.keys(paramArray).sort();
  let md5str = '';
  sortedKeys.forEach((key) => {
    if (paramArray[key]) {
      md5str += `${key}=${paramArray[key]}&`;
    }
  });
  return crypto
    .createHash('md5')
    .update(md5str + 'key=' + mchKey)
    .digest('hex')
    .toUpperCase();
}

// const sign = paramArraySign({
//     mchId: 2612, // Example merchant ID
//     productId: 8044, // Fixed product ID
//     mchOrderNo: "ORD1234567890", // Example unique order number
//     currency: "inr", // Currency type
//     amount: "5000", // Amount in cents (e.g., 50.00 INR)
//     clientIp: "203.0.113.1", // Example IP address
//     device: "Linux", // Example device information
//     returnUrl: "http://localhost:3000/recharge", // Return URL after payment
//     notifyUrl: "http://localhost:3000/api/pay/orderquery", // Notify URL for payment status
//     subject: "Wallet Deposit", // Payment subject
//     body: "Deposit to user wallet", // Payment body
//     uid: "user1234", // Example user ID
//     param1: "dummyParam1", // Dummy parameter 1
//     param2: "dummyParam2", // Dummy parameter 2
//     extra: "extraInfo", // Extra information
//     reqTime: "20240914091500" // Example fixed request time in format YYYYMMDDHHMMSS
//   },'xYZWr2u1qMFtLSWaQhBkjIqS')

async function httpPost(url, paramStr) {
  try {
    console.log("Sending POST request to:", url);
    
    // Log the params for debugging
    console.log("Parameters being sent:", paramStr);

    // Make the POST request with form-encoded data
    const response = await axios.post(url, paramStr, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    // Log the response data for debugging
    console.log("Response data----->", response.data);
    
    return response.data;
  } catch (err) {
    // Log the error
    console.error('HTTP POST Error:', err.message);
    return err.message;
  }
}

// console.log("SIGN IS -->",sign)


module.exports = { paramArraySign, httpPost };
