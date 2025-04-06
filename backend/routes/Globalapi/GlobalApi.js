const express = require('express');
const axios = require('axios');
const router = express.Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/userModel");
const {addTransactionDetails} = require('../../controllers/TransactionHistoryControllers')
require("dotenv").config();

const BASE_URL = process.env.GLOBAL_API_URL;
const CLIENT_ID = process.env.GLOBAL_API_CLIENT_ID;
const CLIENT_SECRET = process.env.GLOBAL_API_CLIENT_SECRET;

// Auth token management
let authToken = null;
let tokenExpiration = 0;

async function getAuthToken(forceRefresh = false) {
    try {
        if (!forceRefresh && authToken && Date.now() < tokenExpiration) {
            return authToken;
        }

        const response = await axios.post(`${BASE_URL}/auth/createtoken`, {
            clientId: CLIENT_ID,
            clientSecret: CLIENT_SECRET
        }, {
            timeout: 10000,
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });

        if (!response.data || !response.data.token) {
            throw new Error('Invalid token response format');
        }

        authToken = response.data.token;
        tokenExpiration = Date.now() + ((response.data.expiration || 3600) * 1000);
        
        return authToken;
    } catch (error) {
        const errorMessage = {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        };
        throw new Error(`Authentication failed: ${error.message}`);
    }
}

function handleApiError(error, res, message) {
    const errorResponse = {
        success: false,
        errorCode: error.response?.status || 500,
        message: message
    };

    if (error.response) {
        errorResponse.details = error.response.data;
    } else if (error.code === 'ENOTFOUND') {
        errorResponse.errorCode = 'NETWORK_ERROR';
        errorResponse.details = 'API endpoint not reachable';
    } else {
        errorResponse.details = error.message;
    }

    res.status(errorResponse.errorCode === 'NETWORK_ERROR' ? 503 : (error.response?.status || 500))
       .json(errorResponse);
}

// Validation middleware
const validateGamesList = (req, res, next) => {
    const { vendorCode, language } = req.body;
    if (!vendorCode || !language) {
        return res.status(400).json({ 
            error: 'Missing required parameters. vendorCode and language are required.' 
        });
    }
    next();
};

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

// Add new endpoints for vendor list and mini games
router.get('/vendors/list', async (req, res) => {
    try {
        const token = await getAuthToken();
        
        const response = await axios.get(
            `${BASE_URL}/vendors/list`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get vendors list');
    }
});

// Update games/list endpoint to match documentation
router.post('/games/list', validateGamesList, async (req, res) => {
    try {
        const { vendorCode, language } = req.body;
        const token = await getAuthToken();
        
        const response = await axios.post(
            `${BASE_URL}/games/list`,
            { vendorCode, language },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get games list');
    }
});

// Add new endpoint for mini games list
router.get('/games/mini/list', async (req, res) => {
    try {
        const token = await getAuthToken();
        
        const response = await axios.get(
            `${BASE_URL}/games/mini/list`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get mini games list');
    }
});


async function depositUserBalance(userCode, balance, orderNo, vendorCode) {
    if (!userCode || !balance) {
        throw new Error('userCode and balance are required');
    }

    const token = await getAuthToken();
    const response = await axios.post(
        `${BASE_URL}/user/deposit`,
        { userCode, balance, orderNo, vendorCode },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}


async function getUserBalance(userCode) {
    if (!userCode) {
        throw new Error('userCode is required');
    }

    const token = await getAuthToken();
    const response = await axios.post(
        `${BASE_URL}/user/balance`,
        { userCode },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        }
    );

    return response.data;
}



router.post('/user/balance',auth, async (req, res) => {
    try {

        const userId = req.user._id; // Authenticated user's ID from token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userCode = user.username;
        const data = await getUserBalance(userCode);
        res.json(data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get user balance');
    }
});
router.post('/user/deposit', async (req, res) => {
    try {
        const { userCode, balance, orderNo, vendorCode } = req.body;
        const data = await depositUserBalance(userCode, balance, orderNo, vendorCode);
        res.json(data);
    } catch (error) {
        handleApiError(error, res, 'Failed to deposit balance');
    }
});


router.post('/user/withdraw', auth, async (req, res) => {
    try {
        const userId = req.user._id; // Authenticated user's ID from token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userCode = user.username;

        // Retrieve balance using getUserBalance function
        const balanceData = await getUserBalance(userCode);
        if (!balanceData.success) {
            return res.status(500).json({ error: 'Failed to retrieve user balance' });
        }
        const balance = balanceData.message;

        // Generate a random 10-digit order number
        const orderNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/user/withdraw`,
            { userCode, balance, orderNo, vendorCode: req.body.vendorCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.data.success) {
            // Add the balance back to the user's walletAmount
            user.walletAmount += balance;
            await user.save();
            await addTransactionDetails(user._id, balance, "Game Moved In", new Date());
        }

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to withdraw balance');
    }
});

router.post('/user/balance-history', async (req, res) => {
    try {
        const { orderNo } = req.body;
        if (!orderNo) {
            return res.status(400).json({ error: 'orderNo is required' });
        }

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/user/balance-history`,
            { orderNo },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get user balance history');
    }
});



// Add new endpoint for game detail
router.post('/game/detail', async (req, res) => {
    try {
        const { vendorCode, gameCode } = req.body;
        if (!vendorCode || !gameCode) {
            return res.status(400).json({ error: 'vendorCode and gameCode are required' });
        }

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/game/detail`,
            { vendorCode, gameCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get game detail');
    }
});






router.post('/betting/history/by-date', async (req, res) => {
    try {
        const { vendorCode, startDate, endDate, page, perPage } = req.body;

        // Input validation
        if (!startDate || !endDate || !page || !perPage) {
            return res.status(400).json({
                success: false,
                message: 'startDate, endDate, page, and perPage are required fields'
            });
        }

        // Validate date format and time span
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        // Check if dates are valid
        if (isNaN(start.getTime()) || isNaN(end.getTime())) {
            return res.status(400).json({
                success: false,
                message: 'Invalid date format. Use yyyy-mm-dd or yyyy-mm-ddThh:mm:ss'
            });
        }

        // Check if time span is within 8 hours
        const hoursDiff = (end - start) / (1000 * 60 * 60);
        if (hoursDiff > 8) {
            return res.status(400).json({
                success: false,
                message: 'Time span between startDate and endDate cannot exceed 8 hours'
            });
        }

        // Check if dates are within last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        if (start < sevenDaysAgo) {
            return res.status(400).json({
                success: false,
                message: 'Cannot retrieve history older than 7 days'
            });
        }

        // Validate perPage limit
        if (perPage > 2000) {
            return res.status(400).json({
                success: false,
                message: 'perPage cannot exceed 2000 records'
            });
        }

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/betting/history/by-date`,
            {
                vendorCode,
                startDate,
                endDate,
                page,
                perPage
            },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get betting history');
    }
});



router.post('/game/launch-url', auth, async (req, res) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userCode = user.username;
        const balance = user.walletAmount-user.holdAmount;
        const language = 'en';
        const lobbyUrl = 'https://747lottery.live';
        const { vendorCode, gameCode } = req.body;

        if (!vendorCode || !gameCode || !userCode || !language) {
            return res.status(400).json({ error: 'Missing required parameters' });
        }

        const orderNo = Math.floor(1000000000 + Math.random() * 9000000000).toString();

        // Only proceed with wallet update if deposit is successful
        if (balance > 0) {
            try {
                const depositResponse = await depositUserBalance(userCode, balance, orderNo, vendorCode);
                console.log(depositResponse);

                // Only update wallet if deposit was successful
                if (depositResponse && depositResponse.success) {
                    user.walletAmount -= balance;
                    await user.save();
                    await addTransactionDetails(user._id, balance, "Game Moved Out", new Date());
                } else {
                    return res.status(500).json({ error: 'Deposit failed', details: 'Deposit response unsuccessful' });
                }
            } catch (error) {
                return res.status(500).json({ error: 'Deposit failed', details: error.message });
            }
        }

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/game/launch-url`,
            { vendorCode, gameCode, userCode, language, lobbyUrl, balance },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to get launch URL');
    }
});

// ...existing code...


router.post('/user/deposit', async (req, res) => {
    try {
        const { userCode, balance, orderNo, vendorCode } = req.body;
        if (!userCode || !balance) {
            return res.status(400).json({ error: 'userCode and balance are required' });
        }

        const token = await getAuthToken();
        const response = await axios.post(
            `${BASE_URL}/user/deposit`,
            { userCode, balance, orderNo, vendorCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        res.json(response.data);
    } catch (error) {
        handleApiError(error, res, 'Failed to deposit balance');
    }
});

module.exports = router;