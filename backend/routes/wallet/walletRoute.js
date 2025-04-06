const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const auth = require("../../middlewares/auth");
const Deposit = require("../../models/depositHistoryModel");
const Commission = require("../../models/commissionModel");
const MainLevelModel = require("../../models/levelSchema");
const moment = require("moment");
const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const axios = require("axios");
const PendingCommission = require("../../models/PendingCommission");
const commissionProcessor = require("../../utils/CommissionProcessor");
const {
  createPendingCommissions,
  processRebate,
} = require("../../utils/commissionAndRebate");
const querystring = require("querystring");
require("dotenv").config();
const crypto = require("crypto");
const Payment = require("../../models/payment");
const DepositBonus = require("../../models/depositBonusSchema");
const secondDepositBonusSchema = require("../../models/secondDepositBonusSchema");
const calculateAndUpdateSpins = require("../SpinnerWheel/CalculateSpinFunction");
const { addNotification } = require('../../controllers/NotificationController');

// const mchKey = process.env.API_KEY;
// const payHost = process.env.CALLBACK_URL;
const cookieParser = require("cookie-parser");
const { paramArraySign, httpPost } = require("../../utils/utils");
const { mchId, mchKey, payHost } = require("../../config/config");
// Initialize the commission processor scheduler
commissionProcessor.initScheduler();

const TOKEN = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiJlNWI1ZmY1YS04M2ZjLTQxMjctYTUzYS0wNDMyODQ4YjQyNzAiLCJqdGkiOiI2YzBjNmFlOGI4YTc3YjlkMzVmOTBiNDZhOWMyMjM4NWRjZjM1OTI0MTM5MjQ4NWJhZWY5ZWFkMjM1NWRiNzEyOTA3NzQzODQ2MjgzNTliNyIsImlhdCI6MTc0MjM4NTM4Ny4yMTAyMDQsIm5iZiI6MTc0MjM4NTM4Ny4yMTAyMDcsImV4cCI6MTc3MzkyMTM4Ny4xODM4NDQsInN1YiI6IjM1MyIsInNjb3BlcyI6W119.ePWhMLNy5fqbcwfMwOhJM89Gj7blVvVsIJLes_vwHwaL1X-r0Kjd5LrYGrpn2Txaw0xZEAaLwmEUOPPlK2sNDFRlDMGQ5fe66HMnoNLiYc0qzbtRzanuGS3M4H24mWeox3Cofdnv4MGnpC_L_1ySOHJ2-R2-L6BRsX_q0ZCmWQG7IC-x87cDp6rQDm14mpDAgoBY0sqnsmeMkkQsTuBlFJX1My6rIi4npU8FtN_18DWSTVQBoxXxQAmH8FijooA_-ZiYPiOkuQaocSMOIg5bBH6vCX1lqxgFAqzoNAAn2aCyt3lLlTCvYavzVQN3kd4ywwESvKflSRSjcr_qAF65V8gzVr9i6xxhDVsSNi6IpF1oQooOM6CBdAor6H0bgx26fyUaxLK237q2SwXufMzCE-XGRZnfHQzzPB1GFkUPD8tU2lbN5kMw0knKY1HR6SbBYv-DmR95kymx6jDb_PcWG21FP3rEV9iOEJYGPmNAtVMku0-niZfSONpHF-fC-uRAe-xEQzEJq3OFX8_a5HPwYzSuiRgI4--B-ga5-B4RWbzHeR97RIuIoX2IOAv5UeBdeur7Kobcf5hgfCTSr71QUKpPQ754VRbIGYPNnhFD6XboNxtITaPWHF30CS6_g69Zmh6W1YTRpEtg1-4XLfKkgGuDfvRf11ncxnH0uG96_j8"; // Replace with the actual token
const HOST = "https://api.bt.cash"; // Replace with the actual host
const USDT_RATE = 95;

const PAYMENT_URL = "https://open.rplapi.com/rupeeLink/api/pay";
const MERCHANT_KEY = "Dw4aDN8bUuiGscSrvt8GVQ2nEERhOeTo"; // Replace with actual key


// Generate MD5 signature
const generateSignatureRupee = (orderCode, amount, userCode, key, status = "") => {
    const signString = status ? `${orderCode}&${amount}&${userCode}&${status}&${key}` : `${orderCode}&${amount}&${userCode}&${key}`;
    return crypto.createHash("md5").update(signString).digest("hex").toUpperCase();
};

function generateMD5Signature(params, secretKey) {
  // Sort and filter parameters
  const sortedParams = Object.keys(params)
      .filter(key => params[key] != null && params[key] !== "")
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
  
  // Append secret key
  const dataToSign = sortedParams + '&key=' + secretKey;
  console.log('Data to Sign:', dataToSign); // Log data to sign for debugging
  
  // Generate MD5 hash
  const sign = crypto.createHash('md5').update(dataToSign).digest('hex').toLowerCase();
  console.log('Generated Signature:', sign); // Log generated signature for debugging
  
  return sign;
}

router.post("/wallet-manual", async (req, res) => {
  try {
    console.log("=== Starting wallet-manual process ===");
    const { amount, userId, depositId } = req.body;
    console.log(
      `Request received - Amount: ${amount}, UserId: ${userId}, DepositId: ${depositId}`
    );

    if (!amount || !userId) {
      console.log("ERROR: Amount or User ID not provided");
      return res.status(400).json({ msg: "Amount and User ID are required" });
    }

    // Fetch commission levels configuration
    console.log("Fetching commission levels configuration...");
    const mainLevelConfig = await MainLevelModel.findOne();
    if (
      !mainLevelConfig ||
      !mainLevelConfig.levels ||
      mainLevelConfig.levels.length === 0
    ) {
      console.log("ERROR: Commission levels configuration not found");
      return res
        .status(500)
        .json({ msg: "Commission levels configuration not found" });
    }

    const { levels } = mainLevelConfig;
    console.log("Commission Levels:", JSON.stringify(levels));

    // Update user wallet
    console.log(`Updating wallet for user ${userId}...`);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $inc: { walletAmount: amount } },
      { new: true }
    );
    if (!updatedUser) {
      console.log(`ERROR: User not found: ${userId}`);
      return res.status(404).json({ msg: "User not found" });
    }
    console.log(
      `User wallet updated. New balance: ${updatedUser.walletAmount}`
    );

    const spinResult = await calculateAndUpdateSpins(userId, amount);
    console.log(`Spin calculation result:`, spinResult);

    // Adjusted error handling
    if (!spinResult || !spinResult.success) {
      console.error(
        "Failed to calculate spins:",
        spinResult ? spinResult.message : "No result"
      );
      // Instead of returning an error response, just log the message and send a success respons
    }

    // Check if user has any completed deposits
    console.log(`Checking for completed deposits for user ${userId}...`);
    const completedDeposits = await Deposit.find({
      userId,
      depositStatus: "completed",
    });
    console.log(`Found ${completedDeposits.length} completed deposits`);

    let firstDepositChecker =
      completedDeposits.length === 0
        ? "firstTimeDepositing"
        : "depositDoneAlready";
    console.log(`First deposit checker: ${firstDepositChecker}`);

    // Update deposit history status if depositId is provided
    if (depositId) {
      console.log(`Updating deposit status for depositId: ${depositId}...`);
      await Deposit.updateOne(
        { userId, _id: depositId },
        { depositStatus: "completed" }
      );
      console.log(`Deposit status updated to 'completed'`);
    }

    // Calculate bonus for first-time deposit
    let bonusAmount = 0;
    if (firstDepositChecker === "firstTimeDepositing") {
      console.log("Calculating bonus for first-time deposit...");
      const depositBonuses = await DepositBonus.find().sort({
        minimumDeposit: 1,
      });
      for (let i = depositBonuses.length - 1; i >= 0; i--) {
        if (amount >= depositBonuses[i].minimumDeposit) {
          bonusAmount = depositBonuses[i].bonus;
          console.log(`Bonus applicable: ${bonusAmount}`);
          break;
        }
      }

      if (bonusAmount > 0) {
        console.log(`Applying bonus of ${bonusAmount} to user wallet...`);
        updatedUser.walletAmount += bonusAmount;
        await updatedUser.save();
        console.log(`New balance after bonus: ${updatedUser.walletAmount}`);

        console.log("Adding transaction details for bonus...");
        await addTransactionDetails(
          userId,
          bonusAmount,
          "DepositBonus",
          new Date(),
          bonusAmount,
          0,
          "N/A",
          null,
          0,
          0
        );
      }
    }

    // Add transaction details for the deposit
    console.log("Adding transaction details for deposit...");
    await addTransactionDetails(
      userId,
      amount,
      "deposit",
      new Date(),
      amount,
      0,
      "N/A",
      null,
      0,
      0,
      firstDepositChecker
    );

    // If this is the user's first deposit, update the user schema
    if (firstDepositChecker === "firstTimeDepositing") {
      console.log(`Updating user schema for first deposit...`);
      await User.findByIdAndUpdate(
        userId,
        { firstDepositMade: true },
        { new: true }
      );
      console.log(`User schema updated: firstDepositMade set to true`);
    }

    // Create pending commissions
    console.log("=== Starting commission creation process ===");
    let currentReferrer = updatedUser.referrer
      ? await User.findById(updatedUser.referrer)
      : null;
    let level = 1;

    while (currentReferrer && level <= 5) {
      console.log(`\n--- Processing level ${level} ---`);
      console.log(`Referrer: ${currentReferrer._id}`);

      const commissionRates = await Commission.findOne();
      if (!commissionRates) {
        console.log("ERROR: Commission rates not found");
        break;
      }

      const commissionRatesArray = [
        commissionRates.level1,
        commissionRates.level2,
        commissionRates.level3,
        commissionRates.level4,
        commissionRates.level5,
      ];

      // Calculate commission based on the current level
      let commission =
        firstDepositChecker === "firstTimeDepositing"
          ? (amount * commissionRatesArray[level - 1]) / 100
          : 0;
      console.log(`Calculated commission: ${commission}`);

      // Create pending commission
      if (commission > 0) {
        console.log("Creating pending commission...");
        const pendingCommission = new PendingCommission({
          referrerId: currentReferrer._id,
          betUserId: userId,
          amount: commission,
          commissionLevel: level,
          betAmount: amount,
          gameType: "deposit",
        });
        await pendingCommission.save();
        console.log(`Pending commission created successfully`);
      } else {
        console.log(`No commission to be added for this level.`);
      }

      // Update subordinates information
      console.log("Updating subordinates information...");
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const subordinateData = {
        userId,
        noOfRegister: 0,
        depositNumber: 1,
        depositAmount: amount,
        firstDeposit: firstDepositChecker === "firstTimeDepositing" ? 1 : 0,
        date: today,
        level,
      };

      if (level === 1) {
        console.log("Updating direct subordinates for level 1...");
        const index = currentReferrer.directSubordinates.findIndex(
          (sub) => sub.date.getTime() === today.getTime()
        );
        if (index !== -1) {
          console.log("Updating existing direct subordinate entry...");
          currentReferrer.directSubordinates[index].depositNumber++;
          currentReferrer.directSubordinates[index].depositAmount += amount;
          if (firstDepositChecker === "firstTimeDepositing") {
            currentReferrer.directSubordinates[index].firstDeposit++;
          }
        } else {
          console.log("Adding new direct subordinate entry...");
          currentReferrer.directSubordinates.push(subordinateData);
        }
      } else {
        console.log(`Updating team subordinates for level ${level}...`);
        const index = currentReferrer.teamSubordinates.findIndex(
          (sub) => sub.date.getTime() === today.getTime()
        );
        if (index !== -1) {
          console.log("Updating existing team subordinate entry...");
          currentReferrer.teamSubordinates[index].depositNumber++;
          currentReferrer.teamSubordinates[index].depositAmount += amount;
          if (firstDepositChecker === "firstTimeDepositing") {
            currentReferrer.teamSubordinates[index].firstDeposit++;
          }
        } else {
          console.log("Adding new team subordinate entry...");
          currentReferrer.teamSubordinates.push(subordinateData);
        }
      }

      // Save updated referrer details
      console.log(`Saving updated referrer details...`);
      await currentReferrer.save();
      console.log(`Referrer details saved successfully`);

      // Move to next referrer up the chain
      console.log("Moving to next referrer...");
      currentReferrer = currentReferrer.referrer
        ? await User.findById(currentReferrer.referrer)
        : null;
      level++;
    }

    console.log("=== Wallet manual process completed successfully ===");
    res.status(200).json({
      msg: "Manual wallet update successful",
      newBalance: updatedUser.walletAmount,
      bonusApplied: bonusAmount,
    });
  } catch (error) {
    console.error("ERROR in wallet-manual process:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
});

// Generate random order number function
const generateRandomOrderNumber = (length) => {
  return crypto.randomBytes(length).toString("hex").substring(0, length);
};






router.post('/api/payment-callback', async (req, res) => {
  try {
    console.log('=== Starting USDT payment callback process ===');
    const {
      merchantOrderNo,
      merchantId,
      amount,
      coinType,
      payCoinAmount,
      callbackCurrencyCode,
      callbackOrderAmount,
      supplementOrderState,
      supplementOrderRemark, 
      status,
      sign,
      currencyOrderAmount,
      addFundsCoinAmount
    } = req.body;

    console.log('Payment callback received:', req.body);
    console.log('Payment callback received:', req.params);
    console.log('Payment callback received:', req.query);

    // Verify signature
    const secretKey = "DtxLefYJm2EhFEoRHNC1K4CmdAjBwTjXXvgEjhLb";

    const params = {
      merchantOrderNo,
      merchantId,
      amount,
      coinType,
      payCoinAmount,
      callbackCurrencyCode,
      callbackOrderAmount,
      supplementOrderState,
      supplementOrderRemark,
      status,
      currencyOrderAmount,
      addFundsCoinAmount
    };

    const generatedSignature = generateMD5Signature(params, secretKey);

    if (generatedSignature !== sign) {
      console.log('Invalid signature');
      return res.status(400).json({ success: false, message: 'Invalid signature' });
    }

    // Find payment record
    const payment = await Payment.findOne({ payOrderId: merchantOrderNo });
    if (!payment) {
      console.log('Payment record not found:', merchantOrderNo);
      return res.status(404).json({ success: false, message: 'Payment not found' });
    }

    const userId = payment.userId;
    const user = await User.findById(userId);
    if (!user) {
      console.log('User not found:', userId);
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Process payment status
    if (status === "1") {
      console.log(`Processing successful payment for order ${merchantOrderNo}`);

      if (!payment.approved) {
        console.log('Payment not yet approved, processing...');
        
        try {
          const amountInUSDT = Number(amount);
          const amountInINR = amountInUSDT * USDT_RATE;
          const amountInDollars = amountInINR;
          console.log(`Converting ${amountInUSDT} USDT to INR: ${amountInINR}`);

          // Fetch commission levels config
          const mainLevelConfig = await MainLevelModel.findOne();
          if (!mainLevelConfig?.levels?.length) {
            console.log('Commission levels configuration not found');
            return res.status(500).json({ success: false, message: 'Commission levels configuration not founood' });
          }

          // Update user wallet
          user.walletAmount += amountInINR;
          console.log(`Updated wallet amount: ${user.walletAmount}`);

          // Calculate spins
          const spinResult = await calculateAndUpdateSpins(userId, amountInDollars);
          if (!spinResult?.success) {
            console.log('Failed to calculate spins:', spinResult?.message);
          }

          // Check for first deposit
          const completedDeposits = await Deposit.find({ userId, depositStatus: "completed" });
          const firstDepositChecker = completedDeposits.length === 0 ? "firstTimeDepositing" : "depositDoneAlready";

          // Update deposit status
          await Deposit.updateOne(
            { userId, _id: payment.depositId }, 
            { depositStatus: "completed" }
          );

          // First deposit bonus
          let bonusAmount = 0;
          if (firstDepositChecker === "firstTimeDepositing") {
            const depositBonuses = await DepositBonus.find().sort({ minimumDeposit: 1 });
            for (let i = depositBonuses.length - 1; i >= 0; i--) {
              if (amountInDollars >= depositBonuses[i].minimumDeposit) {
                bonusAmount = depositBonuses[i].bonus;
                break;
              }
            }

            if (bonusAmount > 0) {
              user.walletAmount += bonusAmount;
              await addTransactionDetails(
                userId,
                bonusAmount,
                "DepositBonus",
                new Date(),
                bonusAmount,
                0,
                "N/A",
                null,
                0,
                0
              );
            }
          }

          // Add transaction record
          await addTransactionDetails(
            userId,
            amountInDollars,
            "deposit",
            new Date(),
            amountInDollars,
            0,
            "N/A",
            null,
            0,
            0,
            firstDepositChecker
          );

          await addNotification(userId, 'Recharge Successful', 'Your USDT deposit was successful.');

          // Update first deposit flag
          if (firstDepositChecker === "firstTimeDepositing") {
            user.firstDepositMade = true;
          }

          await user.save();

          // Process commissions
          let currentReferrer = user.referrer ? await User.findById(user.referrer) : null;
          let level = 1;

          while (currentReferrer && level <= 6) {
            // Process referral commissions...
            // [Previous commission processing code remains the same]
            
            currentReferrer = currentReferrer.referrer ? await User.findById(currentReferrer.referrer) : null;
            level++;
          }

          // Update payment status
          payment.approved = true;
          payment.status = "complete";
          payment.paySuccTime = new Date();
          await payment.save();

        } catch (err) {
          console.error('Error processing payment:', err);
          await Payment.updateOne({ _id: payment._id }, { status: "failed" });
          return res.status(500).json({ success: false, message: 'Error processing payment' });
        }
      } else {
        console.log('Payment already approved');
      }
    }

    console.log('=== Payment callback processed successfully ===');
    res.json({ success: true, message: 'Payment processed successfully' });

  } catch (err) {
    console.error('Error in payment callback:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

router.post('/create-usdt-collection-order', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Request received at '/create-collection-order' route");

  const coinType = "USDT_TRC20";
  const callbackCurrencyCode = "USDT";
  const notifyUrl = "https://api.747lottery.fun/api/payment-callback";
  const version = "1.0";
  const language = "en";
  const signType = "MD5";

  

    const { amount,  merchantOrderNo, } = req.body;
    const secretKey = "DtxLefYJm2EhFEoRHNC1K4CmdAjBwTjXXvgEjhLb"; // Replace with your actual secret key


    if (!amount || !coinType || !merchantOrderNo || !callbackCurrencyCode || !notifyUrl || !version || !language ) {
      
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Merchant order number from request:", merchantOrderNo);

    const amountInCents = Math.round(amount * 95);
    console.log("Amount in cents:", amountInCents);

    // Prepare parameters for the collection order
    const collectionParams = {
      amount: amount,
      coinType,
      merchantId: "10136", // Replace with your actual merchant ID
      merchantOrderNo,
      callbackCurrencyCode,
      notifyUrl,
      version,
      language,
      signType: signType || 'MD5'
    };

    console.log("Collection order parameters prepared:", JSON.stringify(collectionParams, null, 2));

    // Generate signature
    const signature = generateMD5Signature(collectionParams, secretKey);
    collectionParams.sign = signature;

    // Call the collection order API
    console.log("Sending request to collection order API...");
    const response = await axios.post('https://gateway.bishengusdt.com/api/coin/payOrder/createCashier', collectionParams);
    console.log("Collection order API response:", JSON.stringify(response.data, null, 2));

   // After (corrected):
if (!response.data || response.data.code !== "0") {
  console.error("Collection order API failed", JSON.stringify(response.data, null, 2));
  return res.status(500).json({ msg: "Payment API failed", details: response.data });
}

    // Create a new deposit record
    const newDeposit = new Deposit({
      userId: user._id,
      uid: user.uid,
      depositAmount: amountInCents,
      depositDate: new Date(),
      depositStatus: "pending",
      depositId: merchantOrderNo,
      depositMethod: "BS USDT",
    });

    await newDeposit.save();
    console.log("New deposit saved successfully:", JSON.stringify(newDeposit, null, 2));

    // Create a new payment record
    const newPayment = new Payment({
      payOrderId: merchantOrderNo,
      income: amountInCents,
      mchOrderNo: merchantOrderNo,
      amount: amountInCents,
      status: "pending",
      channelOrderNo: merchantOrderNo,
      paySuccTime: null,
      backType: "",
      userId: user._id,
      approved: false,
      depositId: newDeposit._id,
    });

    await newPayment.save();
    console.log("New payment record saved successfully:", JSON.stringify(newPayment, null, 2));

    res.status(201).json({
      msg: "Deposit and Payment created successfully",
      deposit: newDeposit,
      payment: newPayment,
      paymentUrl: response.data.payUrl,
    });
  } catch (err) {
    console.error("Error in '/create-collection-order' route:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});


router.post("/create-btcash-order", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log("Request received at '/create-btcash-order' route");

    let { channel_cashflow_id, amount, order_number, url, redirect_url } = req.body;

    console.log("Request body:", { channel_cashflow_id, amount, userId, order_number, url, redirect_url });

    if (!channel_cashflow_id || !amount || !order_number || !url || !redirect_url) {
      console.log("Missing parameters:", { channel_cashflow_id, amount, userId, order_number, url, redirect_url });
      return res.status(400).json({ msg: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      console.log(`User not found: ${userId}`);
      return res.status(404).json({ msg: "User not found" });
    }

    console.log("Order number from request:", order_number);

    const amountInCents = Math.round(amount * 1);
    console.log("Amount in cents:", amountInCents);

    // Prepare parameters for BTCash
    const btcashParams = {
      channel_cashflow_id,
      amount: amountInCents,
      order_number,
      url,
      redirect_url
    };
    
    console.log("BTCash parameters prepared:", JSON.stringify(btcashParams, null, 2));
    
    // Call BTCash API
    console.log("Sending request to BTCash API...");
    const response = await axios.post(
      `${HOST}/merchant/entrance/invoice/make`,
      btcashParams,
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        }
      }
    );
    console.log("BTCash API response:", JSON.stringify(response.data, null, 2));
    
    // Check if the response is successful
    if (!response.data.data || !response.data.data.number) {
      console.error("BTCash API failed", JSON.stringify(response.data, null, 2));
      return res.status(500).json({ msg: "Payment API failed", details: response.data });
    }
    
    // Create a new deposit record
    const newDeposit = new Deposit({
      userId: user._id,
      uid: user.uid,
      depositAmount: amount,
      depositDate: new Date(),
      depositStatus: "pending",
      depositId: order_number,
      depositMethod: "BTCash",
      depositBonus: 0,
      signupBonus: 0,
    });
    
    await newDeposit.save();
    console.log("New deposit saved successfully:", JSON.stringify(newDeposit, null, 2));
    
    // Create a new payment record
    const newPayment = new Payment({
      payOrderId: order_number,
      income: amount,
      mchOrderNo: order_number,
      amount: amountInCents,
      status: "pending",
      channelOrderNo: response.data.data.number,
      paySuccTime: null,
      backType: "",
      userId: user._id,
      approved: false,
      depositId: newDeposit._id,
    });
    
    await newPayment.save();
    console.log("New payment record saved successfully:", JSON.stringify(newPayment, null, 2));
    
    res.status(201).json({
      msg: "Deposit and Payment created successfully",
      deposit: newDeposit,
      payment: newPayment,
      paymentUrl: response.data.data.url,
    });
  } catch (err) {
    console.error("Error in '/create-btcash-order' route:", err);
    res.status(500).json({ msg: "Internal server error" });
  }
});



router.post("/create-rupee-order", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderCode, amount } = req.body;

    if (!orderCode || !amount) {
      return res.status(400).json({ message: "Missing required parameters" });
    }

    const userCode = "241025919811";
    const callbackUrl = "https://api.747lottery.fun/rupee-payCallback";
    const sign = generateSignatureRupee(orderCode, amount, userCode, MERCHANT_KEY);

    const formData = new URLSearchParams();
    formData.append("userCode", userCode);
    formData.append("orderCode", orderCode);
    formData.append("amount", amount);
    formData.append("callbackUrl", callbackUrl);
    formData.append("sign", sign);

    const response = await axios.post(PAYMENT_URL, formData.toString(), {
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    // Check if the response is successful
    if (!response.data || response.data.code !== 200) {
      console.error("Rupee API failed", JSON.stringify(response.data, null, 2));
      return res.status(500).json({ msg: "Payment API failed", details: response.data });
    }

    // Create a new deposit record
    const newDeposit = new Deposit({
      userId: userId,
      uid: req.user.uid,
      depositAmount: amount,
      depositDate: new Date(),
      depositStatus: "pending",
      depositId: orderCode,
      depositMethod: "Rupee",
    });

    console.log("Saving new deposit record:", JSON.stringify(newDeposit, null, 2));
    await newDeposit.save();
    console.log("New deposit saved successfully:", JSON.stringify(newDeposit, null, 2));

    // Create a new payment record
    const newPayment = new Payment({
      payOrderId: orderCode,
      income: amount,
      mchOrderNo: orderCode,
      amount: amount,
      status: "pending",
      channelOrderNo: response.data.data.orderNo,
      paySuccTime: null,
      backType: "",
      userId: userId,
      approved: false,
      depositId: newDeposit._id,
    });

    console.log("Saving new payment record:", JSON.stringify(newPayment, null, 2));
    await newPayment.save();
    console.log("New payment record saved successfully:", JSON.stringify(newPayment, null, 2));

    res.status(201).json({
      msg: "Deposit and Payment created successfully",
      deposit: newDeposit,
      payment: newPayment,
      paymentUrl: response.data.data.url,
    });
  } catch (error) {
    console.error("Error in '/create-rupee-order' route:", error);
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
});


async function processMLMCommissions(user, amount) {
  let currentReferrer = user.referrer
    ? await User.findById(user.referrer)
    : null;
  let level = 1;

  while (currentReferrer && level <= 5) {
    console.log(
      `\n      Processing level ${level} referrer: ${currentReferrer._id}`
    );

    const commissionRates = await Commission.findOne();
    if (!commissionRates) {
      console.log("      ERROR: Commission rates not found");
      break;
    }

    const commissionRate = commissionRates[`level${level}`];
    console.log(
      `        Commission rate for level ${level}: ${commissionRate}%`
    );
    const commission = (amount * commissionRate) / 100;
    console.log(`        Calculated commission: ${commission}`);

    if (commission > 0) {
      console.log(`        Adding commission to referrer's wallet`);
      console.log(`          Current balance: ${currentReferrer.walletAmount}`);
      currentReferrer.walletAmount += commission;
      console.log(`          New balance: ${currentReferrer.walletAmount}`);

      console.log("        Recording commission transaction");
      await addTransactionDetails(
        currentReferrer._id,
        commission,
        "commission",
        new Date(),
        0,
        0,
        "N/A",
        user._id,
        amount,
        level
      );
      console.log("        Commission transaction recorded");
    }

    console.log("      Updating subordinate statistics");
    await updateSubordinateStatistics(currentReferrer, amount);

    console.log("      Saving updated referrer data");
    await currentReferrer.save();
    console.log(`      Referrer data saved for ${currentReferrer._id}`);

    currentReferrer = currentReferrer.referrer
      ? await User.findById(currentReferrer.referrer)
      : null;
    level++;
  }
}

async function updateSubordinateStatistics(referrer, amount) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let subordinateStats = referrer.teamSubordinates.find(
    (s) => s.date.getTime() === today.getTime()
  );

  if (!subordinateStats) {
    subordinateStats = {
      date: today,
      depositNumber: 0,
      depositAmount: 0,
      firstDeposit: 0,
    };
    referrer.teamSubordinates.push(subordinateStats);
  }

  console.log(`        Before update: ${JSON.stringify(subordinateStats)}`);
  subordinateStats.depositNumber++;
  subordinateStats.depositAmount += amount;
  subordinateStats.firstDeposit++;
  console.log(`        After update: ${JSON.stringify(subordinateStats)}`);
}





router.post("/create-payment-btcash", async (req, res) => {
  console.log("=== Starting create-payment-btcash process ===");
  try {
    const {
      channel_cashflow_id,
      amount,
      payee_name,
      payee_bank_code,
      payee_bank_account,
      payee_phone,
      order_number,
      url,
    } = req.body;

    // Validate required parameters
    if (
      !channel_cashflow_id ||
      !amount ||
      !payee_name ||
      !payee_bank_code ||
      !payee_bank_account ||
      !order_number ||
      !url
    ) {
      return res.status(400).json({ error: "All fields are required" });
    }

    

    // Make API request to create payment
    const response = await axios.post(
      `${HOST}/merchant/entrance/remittance/make`,
      {
        channel_cashflow_id,
        amount,
        payee_name,
        payee_bank_code,
        payee_bank_account,
        payee_phone,
        order_number,
        url,
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`, // Add Authorization header
          "Content-Type": "application/json",
        },
      }
    );

    // Send the API response back to the client
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Error creating payment:", error.message);

    if (error.response) {
      // Handle API error responses
      res.status(error.response.status).json(error.response.data);
    } else {
      // Handle other errors
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});


router.post("/rupee-payCallback", async (req, res) => {
  try {
    const { userCode, orderCode, amount, status, sign } = req.body;
    if (!userCode || !orderCode || !amount || !status || !sign) {
      return res.status(400).send("Missing required parameters");
    }

    const expectedSign = generateSignatureRupee(orderCode, amount, userCode, MERCHANT_KEY, status);
    if (sign !== expectedSign) {
      return res.status(400).send("Invalid signature");
    }

    console.log("Payment Callback Received:1", req.body);
    console.log("Payment Callback Received:2", req.params);
    console.log("Payment Callback Received:3", req.query);

    const order_number = orderCode;
    const amountInCents = Number(amount);
    const amountInDollars = amountInCents / 1;

    try {
      // Validate input
      if (!order_number) {
        console.log("ERROR: Order number not provided");
        return res.status(400).json({ msg: "Order number is required" });
      }

      // Find the payment record by order_number
      const payment = await Payment.findOne({ payOrderId: order_number });
      if (!payment) {
        console.log("No payment found for order number:", order_number);
        return res.status(404).json({ msg: "Payment not found" });
      }

      const userId = payment.userId;
      // Fetch the user
      const user = await User.findById(userId);
      if (!user) {
        console.log("ERROR: User not found:", userId);
        return res.status(404).json({ msg: "User not found" });
      }

      // Process payment status
      if (status === "3") {
        console.log(`Payment success for order number ${order_number}, status: ${status}`);

        if (!payment.approved) {
          console.log("Payment not approved yet, updating user's wallet");

          try {
            console.log(`Adding ${amountInDollars} to user's wallet`);

            // Fetch commission levels configuration
            const mainLevelConfig = await MainLevelModel.findOne();
            if (!mainLevelConfig || !mainLevelConfig.levels || mainLevelConfig.levels.length === 0) {
              console.log("ERROR: Commission levels configuration not found");
              return res.status(500).json({ msg: "Commission levels configuration not found" });
            }

            const { levels } = mainLevelConfig;

            // Update user wallet
            user.walletAmount += amountInDollars;
            console.log(`User wallet updated. New balance: ${user.walletAmount}`);

            const spinResult = await calculateAndUpdateSpins(userId, amountInDollars);
            if (!spinResult || !spinResult.success) {
              console.error("Failed to calculate spins:", spinResult ? spinResult.message : "No result");
            }

            // Check if user has any completed deposits
            const completedDeposits = await Deposit.find({ userId, depositStatus: "completed" });
            let firstDepositChecker = completedDeposits.length === 0 ? "firstTimeDepositing" : "depositDoneAlready";

            // Update deposit history status
            await Deposit.updateOne({ userId, _id: payment.depositId }, { depositStatus: "completed" });

            // Calculate bonus for first-time deposit
            let bonusAmount = 0;
            if (firstDepositChecker === "firstTimeDepositing") {
              const depositBonuses = await DepositBonus.find().sort({ minimumDeposit: 1 });
              for (let i = depositBonuses.length - 1; i >= 0; i--) {
                if (amountInDollars >= depositBonuses[i].minimumDeposit) {
                  bonusAmount = depositBonuses[i].bonus;
                  break;
                }
              }

              if (bonusAmount > 0) {
                user.walletAmount += bonusAmount;
                await addTransactionDetails(userId, bonusAmount, "DepositBonus", new Date(), bonusAmount, 0, "N/A", null, 0, 0);
              }
            }

            // Calculate bonus for second-time deposit
            let secondBonusAmount = 0;
            if (firstDepositChecker === "depositDoneAlready" && !user.secondDepositMade) {
              const secondDepositBonuses = await secondDepositBonusSchema.find().sort({ minimumDeposit: 1 });
              for (let i = secondDepositBonuses.length - 1; i >= 0; i--) {
                if (amountInDollars >= secondDepositBonuses[i].minimumDeposit) {
                  secondBonusAmount = secondDepositBonuses[i].bonus;
                  break;
                }
              }

              if (secondBonusAmount > 0) {
                user.walletAmount += secondBonusAmount;
                await addTransactionDetails(userId, secondBonusAmount, "SecondDepositBonus", new Date(), secondBonusAmount, 0, "N/A", null, 0, 0);
                user.secondDepositMade = true;
              }
            }

            // Add transaction details for the deposit
            await addTransactionDetails(userId, amountInDollars, "deposit", new Date(), amountInDollars, 0, "N/A", null, 0, 0, firstDepositChecker);
            await addNotification(userId, 'Recharge Successful', 'You have recharge successfully.');

            // If this is the user's first deposit, update the user schema
            if (firstDepositChecker === "firstTimeDepositing") {
              user.firstDepositMade = true;
            }

            // Save updated user
            await user.save();

            // Create pending commissions
            let currentReferrer = user.referrer ? await User.findById(user.referrer) : null;
            let level = 1;

            while (currentReferrer && level <= 6) {
              const commissionRates = await Commission.findOne();
              if (!commissionRates) {
                console.log("ERROR: Commission rates not found");
                break;
              }

              const commissionRatesArray = [
                commissionRates.level1,
                commissionRates.level2,
                commissionRates.level3,
                commissionRates.level4,
                commissionRates.level5,
                commissionRates.level6,
              ];

              let commission = firstDepositChecker === "firstTimeDepositing" ? (amountInDollars * commissionRatesArray[level - 1]) / 100 : 0;

              if (commission > 0) {
                const pendingCommission = new PendingCommission({
                  referrerId: currentReferrer._id,
                  betUserId: userId,
                  amount: commission,
                  commissionLevel: level,
                  betAmount: amountInDollars,
                  gameType: "deposit",
                });
                await pendingCommission.save();
              }

              const today = new Date();
              today.setHours(0, 0, 0, 0);

              const subordinateData = {
                userId,
                noOfRegister: 0,
                depositNumber: 1,
                depositAmount: amountInDollars,
                firstDeposit: firstDepositChecker === "firstTimeDepositing" ? 1 : 0,
                date: today,
                level,
              };

              if (level === 1) {
                const index = currentReferrer.directSubordinates.findIndex((sub) => sub.date.getTime() === today.getTime());
                if (index !== -1) {
                  currentReferrer.directSubordinates[index].depositNumber++;
                  currentReferrer.directSubordinates[index].depositAmount += amountInDollars;
                  if (firstDepositChecker === "firstTimeDepositing") {
                    currentReferrer.directSubordinates[index].firstDeposit++;
                  }
                } else {
                  currentReferrer.directSubordinates.push(subordinateData);
                }
              } else {
                const index = currentReferrer.teamSubordinates.findIndex((sub) => sub.date.getTime() === today.getTime());
                if (index !== -1) {
                  currentReferrer.teamSubordinates[index].depositNumber++;
                  currentReferrer.teamSubordinates[index].depositAmount += amountInDollars;
                  if (firstDepositChecker === "firstTimeDepositing") {
                    currentReferrer.teamSubordinates[index].firstDeposit++;
                  }
                } else {
                  currentReferrer.teamSubordinates.push(subordinateData);
                }
              }

              let existingRecord = currentReferrer.commissionRecords.find((record) => record.date.getTime() === today.getTime() && record.uid.toString() === userId.toString());

              if (existingRecord) {
                existingRecord.depositAmount += amountInDollars;
                existingRecord.commission += commission;
              } else {
                currentReferrer.commissionRecords.push({
                  level,
                  commission,
                  date: today,
                  uid: userId,
                  depositAmount: amountInDollars,
                });
              }

              if (commission > 0) {
                currentReferrer.walletAmount += commission;
                await addTransactionDetails(currentReferrer._id, commission, "commission", new Date(), 0, 0, "N/A", userId, amountInDollars, level);
              }

              await currentReferrer.save();
              currentReferrer = currentReferrer.referrer ? await User.findById(currentReferrer.referrer) : null;
              level++;
            }

            payment.approved = true;
            payment.status = "complete";
            payment.paySuccTime = new Date();
            await payment.save();

            console.log(`Payment approved and wallet updated for user: ${userId}`);
          } catch (err) {
            console.error("Error updating wallet and approving payment:", err);
            await Payment.updateOne({ _id: payment._id }, { status: "failed" });
            return res.status(500).send("Error processing payment and updating wallet");
          }
        } else {
          console.log("Payment already approved, skipping wallet update");
        }
      } else if (status === "1") {
        console.log(`Payment still in progress for order number ${order_number}`);
      } else {
        console.log(`Payment failed or not processed correctly for order number ${order_number}, status: ${status}`);
        await Payment.updateOne({ _id: payment._id }, { status: "failed" });
      }

      console.log("=== Callback process completed successfully ===");
      res.status(200).json({ msg: "Payment status processed successfully" });
    } catch (err) {
      console.error("ERROR in '/rupee-payCallback' route:", err);
      if (err.stack) {
        console.error("Error stack trace:", err.stack);
      }
      res.status(500).send("Server Error");
    }
  } catch (error) {
    res.status(500).send("Error processing callback");
  }
});

router.get("/callback-btcash", async (req, res) => {
  console.log("=== Starting callback-btcash process ===");
  console.log("Request query:", req.query);

  const { order_number, amount, status, remark } = req.query;
  console.log(typeof order_number, typeof amount, typeof status, typeof remark);

  try {
    // Validate input
    if (!order_number) {
      console.log("ERROR: Order number not provided");
      return res.status(400).json({ msg: "Order number is required" });
    }
    console.log("=== Starting callback-btcash process ===1");
    // Find the payment record by order_number
    const payment = await Payment.findOne({ payOrderId: order_number });

    if (!payment) {
      console.log("No payment found for order number:", order_number);
      return res.status(404).json({ msg: "Payment not found" });
    }

    const userId = payment.userId;
    console.log("=== Starting callback-btcash process ===2");
    // Fetch the user
    const user = await User.findById(userId);
    if (!user) {
      console.log("ERROR: User not found:", userId);
      return res.status(404).json({ msg: "User not found" });
    }

    // Process payment status
    if (status === "success" || status === "success") {
      console.log(`Payment success for order number ${order_number}, status: ${status}`);
    
      if (!payment.approved) {
        try {
          const amountInCents = Number(amount);
          const amountInDollars = amountInCents / 1;
          console.log(`Adding ${amountInDollars} to user's wallet`);
    
          // Check if user has any completed deposits
          const completedDeposits = await Deposit.find({ userId, depositStatus: "completed" });
          let firstDepositChecker = completedDeposits.length === 0 ? "firstTimeDepositing" : "depositDoneAlready";
           // Update firstDepositMade if this is first deposit
           if (firstDepositChecker === "firstTimeDepositing") {
            user.firstDepositMade = true;
            console.log('Updated firstDepositMade to true');
          }
          // Update secondDepositMade if this is second deposit
          else if (completedDeposits.length === 1 && !user.secondDepositMade) {
            user.secondDepositMade = true; 
            console.log('Updated secondDepositMade to true');
          }
          // Calculate signup bonus (only for first deposit >= 25)
          let signupBonus = 0;
          let depositBonus = 0;
    
        
          // Calculate deposit bonus based on deposit number
          if (firstDepositChecker === "firstTimeDepositing") {
            // First deposit bonus
            signupBonus= 25;
            const depositBonuses = await DepositBonus.find().sort({ minimumDeposit: 1 });
            for (let i = depositBonuses.length - 1; i >= 0; i--) {
              if (amountInDollars >= depositBonuses[i].minimumDeposit) {
                depositBonus = depositBonuses[i].bonus;
                break;
              }
            }
          } else if (completedDeposits.length === 1 && !user.secondDepositMade) {
            // Second deposit bonus
            const secondDepositBonuses = await secondDepositBonusSchema.find().sort({ minimumDeposit: 1 });
            for (let i = secondDepositBonuses.length - 1; i >= 0; i--) {
              if (amountInDollars >= secondDepositBonuses[i].minimumDeposit) {
                depositBonus = secondDepositBonuses[i].bonus;
                user.secondDepositMade = true; // Mark second deposit as made
                break;
              }
            }
          }
    
          if (depositBonus > 0) {
            user.walletAmount += depositBonus;
            await addTransactionDetails(
              userId,
              depositBonus,
              firstDepositChecker === "firstTimeDepositing" ? "DepositBonus" : "SecondDepositBonus",
              new Date(),
              depositBonus,
              0,
              "N/A",
              null,
              0,
              0
            );
          }
      const newdepositBonus = depositBonus*2;
          // Update deposit record with bonus information
          await Deposit.findOneAndUpdate(
            { userId, _id: payment.depositId },
            { 
              depositStatus: "completed",
              depositBonus: newdepositBonus,
              signupBonus: signupBonus,
              $set: { depositStatus: "completed" }
            },
            { new: true }
          );
    
          // Update user wallet with deposit amount
          user.walletAmount += amountInDollars;
          console.log(`User wallet updated. New balance: ${user.walletAmount}`);
    
          // Add transaction details for the deposit
          await addTransactionDetails(
            userId,
            amountInDollars,
            "deposit",
            new Date(),
            amountInDollars,
            0,
            "N/A",
            null,
            0,
            0,
            firstDepositChecker
          );
    
          // Save updated user
          await user.save();

          // Create pending commissions
          let currentReferrer = user.referrer ? await User.findById(user.referrer) : null;
          let level = 1;

          while (currentReferrer && level <= 6) {
            const commissionRates = await Commission.findOne();
            if (!commissionRates) {
              console.log("ERROR: Commission rates not found");
              break;
            }

            const commissionRatesArray = [
              commissionRates.level1,
              commissionRates.level2,
              commissionRates.level3,
              commissionRates.level4,
              commissionRates.level5,
              commissionRates.level6,
            ];

            let commission = firstDepositChecker === "firstTimeDepositing" ? (amountInDollars * commissionRatesArray[level - 1]) / 100 : 0;

            if (commission > 0) {
              const pendingCommission = new PendingCommission({
                referrerId: currentReferrer._id,
                betUserId: userId,
                amount: commission,
                commissionLevel: level,
                betAmount: amountInDollars,
                gameType: "deposit",
              });
              await pendingCommission.save();
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const subordinateData = {
              userId,
              noOfRegister: 0,
              depositNumber: 1,
              depositAmount: amountInDollars,
              firstDeposit: firstDepositChecker === "firstTimeDepositing" ? 1 : 0,
              date: today,
              level,
            };

            if (level === 1) {
              const index = currentReferrer.directSubordinates.findIndex((sub) => sub.date.getTime() === today.getTime());
              if (index !== -1) {
                currentReferrer.directSubordinates[index].depositNumber++;
                currentReferrer.directSubordinates[index].depositAmount += amountInDollars;
                if (firstDepositChecker === "firstTimeDepositing") {
                  currentReferrer.directSubordinates[index].firstDeposit++;
                }
              } else {
                currentReferrer.directSubordinates.push(subordinateData);
              }
            } else {
              const index = currentReferrer.teamSubordinates.findIndex((sub) => sub.date.getTime() === today.getTime());
              if (index !== -1) {
                currentReferrer.teamSubordinates[index].depositNumber++;
                currentReferrer.teamSubordinates[index].depositAmount += amountInDollars;
                if (firstDepositChecker === "firstTimeDepositing") {
                  currentReferrer.teamSubordinates[index].firstDeposit++;
                }
              } else {
                currentReferrer.teamSubordinates.push(subordinateData);
              }
            }

            let existingRecord = currentReferrer.commissionRecords.find((record) => record.date.getTime() === today.getTime() && record.uid.toString() === userId.toString());

            if (existingRecord) {
              existingRecord.depositAmount += amountInDollars;
              existingRecord.commission += commission;
            } else {
              currentReferrer.commissionRecords.push({
                level,
                commission,
                date: today,
                uid: userId,
                depositAmount: amountInDollars,
              });
            }

            if (commission > 0) {
              currentReferrer.walletAmount += commission;
              await addTransactionDetails(currentReferrer._id, commission, "commission", new Date(), 0, 0, "N/A", userId, amountInDollars, level);
            }

            await currentReferrer.save();
            currentReferrer = currentReferrer.referrer ? await User.findById(currentReferrer.referrer) : null;
            level++;
          }

          payment.approved = true;
          payment.status = "complete";
          payment.paySuccTime = new Date();
          await payment.save();

          console.log(`Payment approved and wallet updated for user: ${userId}`);
        } catch (err) {
          console.error("Error updating wallet and approving payment:", err);
          await Payment.updateOne({ _id: payment._id }, { status: "failed" });
          return res.status(500).send("Error processing payment and updating wallet");
        }
      } else {
        console.log("Payment already approved, skipping wallet update");
      }
    } else if (status === "1") {
      console.log(`Payment still in progress for order number ${order_number}`);
    } else {
      console.log(`Payment failed or not processed correctly for order number ${order_number}, status: ${status}`);
      await Payment.updateOne({ _id: payment._id }, { status: "failed" });
    }

    console.log("=== Callback-btcash process completed successfully ===");
    res.status(200).json({ msg: "Payment status processed successfully" });
  } catch (err) {
    console.error("ERROR in '/callback-btcash' route:", err);
    if (err.stack) {
      console.error("Error stack trace:", err.stack);
    }
    res.status(500).send("Server Error");
  }
});



router.post("/rejectDeposit", async (req, res) => {
  try {
    const { userId, depositId } = req.body;
    if (!userId || !depositId) {
      return res
        .status(400)
        .json({ msg: "User ID and Deposit ID are required" });
    }

    // Update specific deposit status
    await Deposit.updateOne(
      { userId: userId, _id: depositId },
      { depositStatus: "failed" }
    );

    res.status(200).json({ msg: "Deposit status updated to failed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.post("/createDeposit", auth, async (req, res) => {
  try {
    const { amount, depositMethod, depositId } = req.body;

    // Validate the amount
    if (!amount) {
      return res.status(400).json({ msg: "Amount is required" });
    }

    // Convert amount to a number
    const depositAmount = Number(amount);
    if (isNaN(depositAmount)) {
      return res.status(400).json({ msg: "Amount must be a number" });
    }

    const userId = req.user._id;

    // Check if a deposit with the same depositId already exists for the user
    let existingDepositQuery = { userId: userId };

    // Only add depositId to query if it's provided and valid
    if (depositId) {
      // If depositId looks like a valid ObjectId, use it directly
      // Otherwise, use it as a string field
      if (/^[0-9a-fA-F]{24}$/.test(depositId)) {
        existingDepositQuery._id = depositId;
      } else {
        existingDepositQuery.depositId = depositId;
      }
    }

    const existingDeposit = await Deposit.findOne(existingDepositQuery);

    if (existingDeposit) {
      return res
        .status(400)
        .json({ msg: "This deposit ID has already been used." });
    }

    // Fetch the user to check account type
    const user = await User.findById(userId);

    // Check if the user is restricted
    if (user.accountType === "Restricted") {
      // Automatically credit the amount to the user's wallet
      const completedDeposits = await Deposit.find({
        userId,
        depositStatus: "completed",
      });

      let firstDepositChecker =
        completedDeposits.length > 0
          ? "depositDoneAlready"
          : "firstTimeDepositing";

      // Update walletAmount by adding the depositAmount
      user.walletAmount += depositAmount;
      await user.save();

      // Create deposit history with status 'completed'
      const depositHistory = new Deposit({
        userId: userId,
        uid: user.uid,
        depositAmount: depositAmount,
        depositDate: new Date(),
        depositStatus: "completed",
        depositMethod: depositMethod,
      });

      // Only set depositId if it's provided
      if (depositId) {
        depositHistory.depositId = depositId;
      }

      await depositHistory.save();

      await addTransactionDetails(
        userId,
        depositAmount,
        "deposit",
        new Date(),
        depositAmount,
        0,
        "N/A",
        null,
        0,
        0,
        firstDepositChecker
      );

      return res
        .status(200)
        .json({ msg: "Deposit created and amount credited to wallet." });
    }

    // Create deposit history with status 'pending' for non-restricted users
    const depositHistory = new Deposit({
      userId: userId,
      uid: user.uid,
      depositAmount: depositAmount,
      depositDate: new Date(),
      depositStatus: "pending",
      depositMethod: depositMethod,
    });

    // Only set depositId if it's provided
    if (depositId) {
      depositHistory.depositId = depositId;
    }

    await depositHistory.save();

    res.status(200).json({ msg: "Deposit created" });
  } catch (err) {
    console.error("Deposit creation error:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});


router.get("/admin/deposit/history", auth, isAdmin, async (req, res) => {
  try {
    // Get all deposits
    const depositHistory = await Deposit.find();

    // Get all user IDs from the deposit history
    const userIds = depositHistory.map((deposit) => deposit.userId);

    // Find users whose accountType is not "Restricted"
    const users = await User.find(
      { _id: { $in: userIds }, accountType: { $ne: "Restricted" } },
      "mobile accountType"
    );

    // Create a mapping of user IDs to mobile numbers
    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user.mobile;
      return acc;
    }, {});

    // Transform the deposit history to include only relevant deposits
    const transformedHistory = depositHistory
      .filter((deposit) => userMap[deposit.userId]) // Filter deposits based on users with non-restricted accounts
      .map((deposit) => ({
        _id: deposit._id,
        uid: deposit.uid,
        depositAmount: deposit.depositAmount,
        depositDate: deposit.depositDate,
        depositStatus: deposit.depositStatus,
        depositId: deposit.depositId,
        depositMethod: deposit.depositMethod,
        userId: deposit.userId,
        mobile: userMap[deposit.userId], // Get mobile number from the map
      }));

    res.status(200).json(transformedHistory);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/deposit/history", auth, async (req, res) => {
  try {
    const depositHistory = await Deposit.find({ userId: req.user._id });
    res.status(200).json(depositHistory);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/pending-recharge", auth, isAdmin, async (req, res) => {
  try {
    // Find all deposits with a pending status
    const pendingRecharges = await Deposit.find({ depositStatus: "pending" });

    // Check if there are any pending recharges
    if (pendingRecharges.length === 0) {
      return res.status(200).json({
        pendingAmount: 0,
        count: 0,
        success: true,
        message: "No transaction is in pending state",
      });
    }

    // Calculate the total pending amount
    let totalPendingAmount = pendingRecharges.reduce(
      (total, deposit) => total + deposit.depositAmount,
      0
    );

    // Return the total pending amount and count
    res.status(200).json({
      pendingAmount: totalPendingAmount,
      count: pendingRecharges.length,
      success: true,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/success-recharge", auth, isAdmin, async (req, res) => {
  try {
    // Fetch deposits and populate the user details
    const allDeposit = await Deposit.find()
      .populate({
        path: "userId", // Populate the userId field
        select: "accountType", // Only fetch the accountType field
      });

    if (!allDeposit) {
      console.log("No deposits found in the DB");
      return res.status(200).json({
        successRechargeAmount: 0,
        success: true,
        message: "No success recharge done yet",
      });
    }

    // Filter deposits for users with accountType "Normal"
    const successRechargeArray = allDeposit.filter(
      (deposit) =>
        deposit.depositStatus === "completed" &&
        deposit.userId?.accountType === "Normal"
    );

    if (successRechargeArray.length === 0) {
      return res.status(200).json({
        successRechargeAmount: 0,
        success: true,
        message: "No success recharge done yet",
      });
    }

    // Calculate the total success recharge amount
    const totalSuccessAmount = successRechargeArray.reduce(
      (total, deposit) => total + deposit.depositAmount,
      0
    );

    res.status(200).json({
      successAmount: totalSuccessAmount,
      success: true,
      message: "Data fetched successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});


router.post("/attendance", auth, async (req, res) => {
  try {
    console.log(
      `User ID: ${req.user._id}, Last Bonus Withdrawal: ${req.user.lastBonusWithdrawal}`
    );

    const today = new Date().setHours(0, 0, 0, 0);
    const lastClaimDate = req.user.lastBonusWithdrawal
      ? new Date(req.user.lastBonusWithdrawal).setHours(0, 0, 0, 0)
      : null;

    // Check if bonus already claimed today
    if (lastClaimDate === today) {
      console.log("Bonus already claimed today.");
      return res
        .status(400)
        .json({ msg: "You have already claimed the bonus today" });
    }

    // Only get completed deposits
    const deposits = await Deposit.find({ 
      userId: req.user._id,
      depositStatus: "completed" // Only consider completed deposits
    });
    
    if (deposits.length === 0) {
      console.log("No completed deposit history found.");
      return res.status(400).json({
        msg: "Players with no completed deposit history cannot claim the bonus",
      });
    }

    // Calculate total from completed deposits only
    const totalDeposit = deposits.reduce(
      (sum, deposit) => sum + deposit.depositAmount,
      0
    );
    console.log(`Total Completed Deposits Amount: ${totalDeposit}`);

    const bonusStructure = [
      { day: 1, requiredDeposit: 500, bonus: 11 },
      { day: 2, requiredDeposit: 1000, bonus: 21 },
      { day: 3, requiredDeposit: 5000, bonus: 101 },
      { day: 4, requiredDeposit: 10000, bonus: 201 },
      { day: 5, requiredDeposit: 20000, bonus: 401 },
      { day: 6, requiredDeposit: 100000, bonus: 2551 },
      { day: 7, requiredDeposit: 200000, bonus: 7051 },
    ];

    let consecutiveDays = req.user.consecutiveDays || 0;
    const previousDate = new Date(today - 86400000); // Yesterday

    // Determine the day to claim
    let dayToClaim;
    if (!lastClaimDate || lastClaimDate < previousDate) {
      // If first claim or missed a day, start from day 1
      dayToClaim = 1;
    } else if (lastClaimDate === previousDate.getTime()) {
      // If claimed yesterday, move to next day
      dayToClaim = (consecutiveDays % 7) + 1;
    } else {
      return res
        .status(400)
        .json({ msg: "You can only claim the bonus once per day" });
    }

    const currentDay = bonusStructure.find((day) => day.day === dayToClaim);
    if (!currentDay) {
      return res.status(400).json({ msg: "Invalid claim day" });
    }

    if (totalDeposit < currentDay.requiredDeposit) {
      console.log("Deposit requirements not met for the current day's bonus.");
      return res.status(400).json({
        msg: "Deposit requirements not met for the current day's bonus",
        requiredDeposit: currentDay.requiredDeposit,
        currentDeposit: totalDeposit,
      });
    }

    const bonusAmount = currentDay.bonus;
    console.log(`Bonus Amount Credited: ${bonusAmount}`);

    req.user.walletAmount += bonusAmount;
    req.user.lastBonusWithdrawal = new Date();
    req.user.totalBonusAmount += bonusAmount;
    req.user.consecutiveDays = dayToClaim;

    console.log(`Updated User Wallet Amount: ${req.user.walletAmount}`);
    console.log(`New Consecutive Days Count: ${req.user.consecutiveDays}`);
    console.log(`Total Bonus Accumulated: ${req.user.totalBonusAmount}`);

    await req.user.save();

    // Add transaction details with type "Attendance Bonus"
    await addTransactionDetails(
      req.user._id,
      bonusAmount,
      "AttendanceBonus", // Type
      new Date(), // Current date
      0, // depositAmount
      0, // betAmount
      "N/A", // gameType
      null, // commissionFromUser
      0, // depositAmountOfUser
      0, // commissionLevel
      req.user.consecutiveDays === 1
        ? "notDepositYet"
        : req.user.consecutiveDays // firstDepositChecker
    );

    res.json({
      msg: `Daily bonus claimed successfully`,
      bonusAmount: bonusAmount,
      consecutiveDays: req.user.consecutiveDays,
      nextConsecutiveDay: (req.user.consecutiveDays % 7) + 1,
      totalDeposit: totalDeposit,
      totalBonusAccumulated: req.user.totalBonusAmount,
    });
  } catch (err) {
    console.error(`Error Message: ${err.message}`);
    res.status(500).send("Server Error");
  }
});

router.get("/previous-day-stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    // Calculate the start of the previous day
    const startOfPreviousDay = new Date(now);
    startOfPreviousDay.setDate(now.getDate() - 1);
    startOfPreviousDay.setHours(0, 0, 0, 0);

    // Calculate the end of the previous day
    const endOfPreviousDay = new Date(now);
    endOfPreviousDay.setDate(now.getDate() - 1);
    endOfPreviousDay.setHours(23, 59, 59, 999);

    // Fetch user data to get subordinates' information
    const user = await User.findById(userId)
      .populate("directSubordinates.userId", "username")
      .populate("teamSubordinates.userId", "username");

    // Fetch commission rates
    const commissionRates = await Commission.findOne();

    // Fetch and filter deposit records for the previous day only
    const twentyFourHourDeposits = await Deposit.find({
      userId: {
        $in: [userId, ...user.directSubordinates.map((sub) => sub.userId)],
      },
      depositDate: { $gte: startOfPreviousDay, $lte: endOfPreviousDay }, // Only deposits within the previous day
    });

    // Calculate total profit (commission earned)
    let totalProfit = 0;

    // Check if there are any direct subordinates
    if (user.directSubordinates.length === 0) {
      console.log("No direct subordinates found.");
    } else {
      // Calculate commission for direct subordinates
      for (const deposit of twentyFourHourDeposits) {
        if (userId.equals(deposit.userId)) {
          continue; // Skip the user's own deposit
        }
        const sub = user.directSubordinates.find((sub) =>
          sub.userId.equals(deposit.userId)
        );
        if (sub) {
          const commissionRate = commissionRates[`level${sub.level}`] || 0;
          totalProfit += deposit.depositAmount * commissionRate;
        }
      }
    }

    // Check if there are any team subordinates
    if (user.teamSubordinates.length === 0) {
      console.log("No team subordinates found.");
    } else {
      // Calculate commission for team subordinates
      for (const teamSubordinate of user.teamSubordinates) {
        const subUserId = teamSubordinate.userId;

        // Filter deposits made by the current team subordinate
        const subUserDeposits = twentyFourHourDeposits.filter((deposit) =>
          deposit.userId.equals(subUserId)
        );

        // Calculate commission for each deposit made by the team subordinate
        for (const deposit of subUserDeposits) {
          const commissionRate =
            commissionRates[`level${teamSubordinate.level}`] || 0;
          totalProfit += deposit.depositAmount * commissionRate;
        }
      }
    }

    // Fetch and map data for direct subordinates
    const directSubordinatesData = await Promise.all(
      user.directSubordinates.map(async (sub) => {
        const subUserId = sub.userId._id;
        const subUserDeposits = await Deposit.find({
          userId: subUserId,
          depositDate: { $gte: startOfPreviousDay, $lte: endOfPreviousDay }, // Only deposits within the previous day
        });
        const subUserTotalProfit = subUserDeposits.reduce(
          (total, deposit) => total + deposit.depositAmount,
          0
        );
        const commissionRate = commissionRates[`level${sub.level}`] || 0;
        const subUserCommission = subUserTotalProfit * commissionRate;
        return {
          username: sub.userId.username,
          depositAmount: subUserTotalProfit,
          commission: subUserCommission,
        };
      })
    );

    // Fetch and map data for team subordinates
    const teamSubordinatesData = await Promise.all(
      user.teamSubordinates.map(async (sub) => {
        const subUserId = sub.userId._id;
        const subUserDeposits = await Deposit.find({
          userId: subUserId,
          depositDate: { $gte: startOfPreviousDay, $lte: endOfPreviousDay }, // Only deposits within the previous day
        });
        const subUserTotalProfit = subUserDeposits.reduce(
          (total, deposit) => total + deposit.depositAmount,
          0
        );
        const commissionRate = commissionRates[`level${sub.level}`] || 0;
        const subUserCommission = subUserTotalProfit * commissionRate;
        return {
          username: sub.userId.username,
          depositAmount: subUserTotalProfit,
          commission: subUserCommission,
          level: sub.level,
        };
      })
    );

    res.status(200).json({
      totalProfit,
      directSubordinates: directSubordinatesData,
      teamSubordinates: teamSubordinatesData,
      timeFrame: {
        start: startOfPreviousDay.toISOString(),
        end: endOfPreviousDay.toISOString(),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});



router.post("/user/bank-details", auth, async (req, res) => {
  // Validate the incoming data
  const { name, accountNo, ifscCode, mobile, bankName } = req.body;
  if (!name || !accountNo || !ifscCode || !mobile) {
    return res.status(400).send("All fields are required");
  }

  // Create a new bank detail
  const newBankDetail = { name, accountNo, ifscCode, mobile, bankName };

  try {
    // Check if the account number already exists for any user
    const existingUser = await User.findOne({ "bankDetails.accountNo": accountNo });
    if (existingUser) {
      return res.status(400).send("Account number already exists. Use another account number.");
    }

    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user already has bank details
    const existingBankDetailIndex = user.bankDetails.findIndex(
      (detail) => detail.accountNo === accountNo
    );

    if (existingBankDetailIndex > -1) {
      // Update existing bank detail
      user.bankDetails[existingBankDetailIndex] = newBankDetail;
    } else {
      // Add new bank detail if not already present
      if (user.bankDetails && user.bankDetails.length > 0) {
        return res
          .status(400)
          .send(
            "Bank details already added. You cannot add more bank details."
          );
      }
      user.bankDetails.push(newBankDetail);
    }

    await user.save();

    res.send(user);
  } catch (err) {
    res.status(500).send("Server error: " + err.message);
  }
});

router.get("/user/bank-details/show", auth, async (req, res) => {
  try {
    console.log("Received request to get user bank details");

    // Find the user
    console.log("Finding user with ID:", req.user._id);
    const user = await User.findById(req.user._id);

    if (!user) {
      console.log("User not found");
      return res.status(404).send("User not found");
    }

    console.log("User found:", user);

    // Check if the user has bank details
    if (!user.bankDetails || user.bankDetails.length === 0) {
      console.log("No bank details found for this user.");
      return res.status(200).json([]); // Return an empty array if no bank details are found
    }

    console.log("Bank details found:", user.bankDetails);

    // Send the bank details
    res.send(user.bankDetails);
    console.log("Bank details sent successfully");
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});

router.post("/user/trxaddress-update", auth, async (req, res) => {
  const { address, alias } = req.body;

  // Log the incoming request data
  console.log("Received TRX address update request:", { address, alias });

  // Validate the incoming data
  if (!address || !alias) {
    console.log("Validation failed: Missing address or alias");
    return res.status(400).send("Both address and alias are required");
  }

  try {
    // Check if the TRX address already exists for any user
    const existingUser = await User.findOne({ "TRXAddress.address": address });
    if (existingUser) {
      console.log("TRX address already exists. Use another address.");
      return res.status(400).send("TRX address already exists. Use another address.");
    }

    // Find the user by ID
    const user = await User.findById(req.user._id);
    if (!user) {
      console.log("User not found with ID:", req.user._id);
      return res.status(404).send("User not found");
    }

    // Check if the user already has a TRX address
    if (user.TRXAddress && user.TRXAddress.length > 0) {
      console.log(
        "User already has a TRX address. Cannot add more.",
        user.TRXAddress
      );
      return res
        .status(400)
        .send("TRX Address already added. You cannot add more TRX Addresses.");
    }

    // Add the new TRX address and alias
    console.log("Adding TRX address for user:", req.user._id);
    user.TRXAddress.push({ address, alias });
    await user.save();

    console.log("TRX address successfully added:", user.TRXAddress);
    res.send(user);
  } catch (err) {
    console.error("Error occurred while updating TRX address:", err.message);
    res.status(500).send("Server error: " + err.message);
  }
});
router.get("/user/trxaddress-show", auth, async (req, res) => {
  try {
    // Find the user
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send("User not found");
    }

    // Check if the user has bank details
    if (!user.TRXAddress || user.TRXAddress.length === 0) {
      return res.status(404).send("No TRX Address found for this user.");
    }

    // Send the bank details
    res.send({ walletAddress: user.TRXAddress, network: "TRC 20" });
  } catch (err) {
    res.status(500).send("Server error" + err.message);
  }
});

router.post("/deposit-dragonpay", auth, async (req, res) => {
  const { user, am, orderid, depositMethod } = req.body;
  const userId = req.user._id;

  const depositHistory = new Deposit({
    userId: userId,
    uid: req.user.uid,
    depositAmount: am,
    depositDate: new Date(),
    depositStatus: "pending",
    depositId: orderid,
    depositMethod: depositMethod,
  });
  await depositHistory.save();

  const amountInCents = am * 100; // Convert amount to cents
  const paramArray = {
    mchId: process.env.MERCHANT_ID,
    productId: 8036,
    mchOrderNo: Math.floor(Math.random() * 100000000000), // This will generate a random number between 0 and 99999999999
    currency: "INR",
    amount: amountInCents.toString(),
    returnUrl: "https://dragonclubs.online/wallet",
    notifyUrl: "https://dragonclubs.online/wallet",
    subject: "online shopping",
    body: "something goods",
    param1: userId,
    param2: orderid,
    reqTime: new Date()
      .toISOString()
      .replace(/[-T:.Z]/g, "")
      .slice(0, 14), // Format yyyyMMddHHmmss
  };

  paramArray.sign = paramArraySign(paramArray, mchKey);

  try {
    const response = await axios.post(
      `${payHost}/api/pay/neworder`,
      new URLSearchParams(paramArray).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

router.post("/deposit", auth, async (req, res) => {
  const { user, am, orderid, depositMethod } = req.body;
  const userId = req.user._id;

  const depositHistory = new Deposit({
    userId: userId,
    uid: req.user.uid,
    depositAmount: am,
    depositDate: new Date(),
    depositStatus: "pending",
    depositId: orderid,
    depositMethod: depositMethod,
  });
  await depositHistory.save();
  const params = {
    mchId: "8q116684",
    passageId: 28701,
    orderAmount: am,
    orderNo: orderid, // You might want to generate a unique order number
    notifyUrl: "https://luckywingo.tech/wallet-gtrpay",
    callBackUrl: "https://luckywingo.tech/wallet-gtrpay",
    remark: userId,
    number: orderid,
    email: "email",
  };

  // Generate the MD5 signature
  params.sign = generateSignature(params, secretKey);

  try {
    // Send POST request to the payment gateway
    const response = await axios.post(
      "https://wg.gtrpay001.com/collect/create",
      params,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    res.json(response.data);
  } catch (error) {
    res
      .status(500)
      .json({ error: error.response ? error.response.data : error.message });
  }
});

router.get("/user/depositHistory/sum", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(userId);
    const depositHistories = await Deposit.find({
      userId: userId,
      depositStatus: "completed",
    });
    const sum = depositHistories.reduce(
      (total, deposit) => total + deposit.depositAmount,
      0
    );
    res.json({ totalDeposit: sum });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/commission-levelwise", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    const commissionSum = user.commissionRecords.reduce((acc, record) => {
      if (!acc[record.level]) {
        acc[record.level] = 0;
      }
      acc[record.level] += record.commission;
      return acc;
    }, {});

    res.send(commissionSum);
  } catch (error) {
    res.status(500).send({ message: "Server error" });
  }
});



router.get("/admin/user-bank-details", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "bankDetails username uid"); // Adjust fields as needed
    const usersWithBankDetails = users.filter(
      (user) => user.bankDetails.length > 0
    );
    res.json({
      success: true,
      message: "Here are the bank details of all users",
      bankDetails: usersWithBankDetails.map((user) => ({
        username: user.username,
        uid: user.uid,
        bankDetails: user.bankDetails,
      })),
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "An error occurred", error });
  }
});

// Update user bank details
router.put(
  "/admin/user-bank-details/:uid/:bankId",
  auth,
  isAdmin,
  async (req, res) => {
    const { uid, bankId } = req.params;
    const { bankName, accountNo, ifscCode, mobile } = req.body;

    try {
      const user = await User.findOne({ uid });
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      const bankDetail = user.bankDetails.id(bankId);
      if (!bankDetail) {
        return res
          .status(404)
          .json({ success: false, message: "Bank detail not found" });
      }

      bankDetail.bankName = bankName || bankDetail.bankName;
      bankDetail.accountNo = accountNo || bankDetail.accountNo;
      bankDetail.ifscCode = ifscCode || bankDetail.ifscCode;
      bankDetail.mobile = mobile || bankDetail.mobile;

      await user.save();

      res.json({ success: true, message: "Bank details updated successfully" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "An error occurred", error });
    }
  }
);

module.exports = router;
