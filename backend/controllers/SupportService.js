const User = require("../models/userModel");
const Retrive = require("../models/Support");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const GameProblem = require("../models/GameProblem");

/**
 * Validation utility functions
 */
const validators = {
  /**
   * Validates that input is a non-empty string
   * @param {*} input - The input to validate
   * @param {string} paramName - Name of the parameter for error messages
   * @returns {string} - The validated string
   * @throws {Error} If validation fails
   */
  string: (input, paramName) => {
    if (typeof input !== 'string' || input.trim() === '') {
      throw new Error(`${paramName} must be a non-empty string`);
    }
    return input.trim();
  },

  /**
   * Validates an email address format
   * @param {string} email - Email to validate
   * @returns {string} - The validated email
   * @throws {Error} If validation fails
   */
  email: (email) => {
    if (typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error("Invalid email format");
    }
    return email.trim().toLowerCase();
  },

  /**
   * Validates IFSC code format (Indian Financial System Code)
   * @param {string} ifsc - IFSC code to validate
   * @returns {string} - The validated IFSC code
   * @throws {Error} If validation fails
   */
  ifscCode: (ifsc) => {
    // IFSC code is 11 characters: first 4 are letters (bank code), 5th is 0 (reserved), last 6 can be alphanumeric
    if (typeof ifsc !== 'string' || !/^[A-Z]{4}0[A-Z0-9]{6}$/.test(ifsc)) {
      throw new Error("Invalid IFSC code format. Should be 11 characters with format: AAAA0XXXXXXX");
    }
    return ifsc;
  },

  /**
   * Validates account number format (basic check)
   * @param {string} accNum - Account number to validate
   * @returns {string} - The validated account number
   * @throws {Error} If validation fails
   */
  accountNumber: (accNum) => {
    // Basic validation: between 9-18 digits
    if (typeof accNum !== 'string' || !/^\d{9,18}$/.test(accNum)) {
      throw new Error("Invalid bank account number. Should be 9-18 digits");
    }
    return accNum;
  },

  /**
   * Validates password strength
   * @param {string} password - Password to validate
   * @returns {string} - The validated password
   * @throws {Error} If validation fails
   */
  password: (password) => {
    if (typeof password !== 'string' || password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }
    
    // Check for password strength (optional)
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!(hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar)) {
      throw new Error("Password must contain uppercase, lowercase, numbers, and special characters");
    }
    
    return password;
  },

  /**
   * Validates that a required file exists
   * @param {Object} file - File object to validate
   * @param {string} fieldName - Name of the file field
   * @returns {Object} - The validated file object
   * @throws {Error} If validation fails
   */
  requiredFile: (file, fieldName) => {
    if (!file || !file.filename) {
      throw new Error(`${fieldName} file is required`);
    }
    return file;
  },

  /**
   * Validates game ID format
   * @param {string} gameId - Game ID to validate
   * @returns {string} - The validated game ID
   * @throws {Error} If validation fails
   */
  gameId: (gameId) => {
    // Assuming game IDs are alphanumeric with possible hyphens, minimum 4 chars
    if (typeof gameId !== 'string' || !/^[A-Za-z0-9-]{4,}$/.test(gameId)) {
      throw new Error("Invalid game ID format");
    }
    return gameId;
  }
};

/**
 * Sanitizes an object by removing potential XSS attack vectors
 * @param {Object} obj - Object to sanitize
 * @returns {Object} - Sanitized object
 */
function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  
  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      // Basic HTML sanitization
      sanitized[key] = value
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

/**
 * Validates request body existence
 * @param {Object} req - Express request object
 * @throws {Error} If validation fails
 */
function validateRequestBody(req) {
  if (!req.body || Object.keys(req.body).length === 0) {
    throw new Error("Missing or empty request body");
  }
}

/**
 * Logs detailed error information
 * @param {string} functionName - Name of the function where error occurred
 * @param {Error} error - Error object
 */
function logError(functionName, error) {
  console.error(`[${new Date().toISOString()}] Error in ${functionName}:`, {
    message: error.message,
    stack: error.stack,
  });
}

/**
 * Creates upload directory if it doesn't exist
 */
const uploadDir = path.join(__dirname, '..', '..', "upload");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * Storage configuration for multer
 */
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const fileExt = path.extname(file.originalname);
    
    // Sanitize original filename to prevent directory traversal
    const sanitizedFileName = file.fieldname + '-' + uniqueSuffix + fileExt;
    
    cb(null, sanitizedFileName);
  },
});

/**
 * File filter function to validate uploaded files
 * @param {Object} req - Express request object
 * @param {Object} file - Uploaded file object
 * @param {Function} cb - Callback function
 */
const fileFilter = (req, file, cb) => {
  try {
    // Check if file exists
    if (!file) {
      cb(new Error('No file uploaded'), false);
      return;
    }

    // Validate file size within reasonable limits (done in multer config, additional check here)
    if (parseInt(req.headers['content-length']) > 15 * 1024 * 1024) {
      cb(new Error('File too large'), false);
      return;
    }

    // Check mime type
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedMimes.includes(file.mimetype)) {
      cb(new Error('Invalid file type. Only JPEG, JPG, PNG, GIF, and WEBP images are allowed'), false);
      return;
    }

    // Validate file extension matches mimetype
    const extension = path.extname(file.originalname).toLowerCase();
    const validExtensions = {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/jpg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    };

    if (!validExtensions[file.mimetype].includes(extension)) {
      cb(new Error(`File extension ${extension} does not match file type ${file.mimetype}`), false);
      return;
    }

    cb(null, true);
  } catch (error) {
    cb(error, false);
  }
};

/**
 * Configured multer upload middleware
 */
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // limit file size to 10MB
    files: 5 // limit number of files
  },
  fileFilter: fileFilter,
});

/**
 * Changes user password and updates user profile with uploaded files
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
const ChangePasswordOne = async (req, res) => {
  try {

    const { mobile,newPassword } = req.body;
    
    if (!newPassword || !mobile) {
      return res.status(400).json({ 
        success: false,
        msg: "Username and new password are required" 
      });
    }
    
    
    
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    
    // Check if user exists before update
    const existingUser = await User.findOne({ mobile: mobile });
    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }
    
    const updateUser = await User.findOneAndUpdate(
      { mobile: mobile },
      { 
        password: hashPassword, 
        plainPassword: newPassword, // Consider removing plainPassword storage for security
      },
      { new: true }
    );
    
    if (!updateUser) {
      return res.status(500).json({ 
        success: false,
        msg: "Failed to update user" 
      });
    }
    
    
    return res.status(201).json({
      msg: "User Updated",
      updatedDoc: updateUser,
      success: true,
      message: 'Files uploaded successfully',
    });
  } catch (error) {
    logError("ChangePasswordOne", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};


const ChangePasswordtwo = async (req, res) => {
  try {
    // Validate request body
    validateRequestBody(req);
    
    // Rate limiting check (basic implementation)
    const clientIP = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Sanitize inputs
    const sanitizedBody = sanitizeObject(req.body);
    const { newPassword, username } = sanitizedBody;
    
    if (!newPassword || !username) {
      return res.status(400).json({ 
        success: false,
        msg: "Username and new password are required" 
      });
    }
    
    // Validate password and username
    validators.string(username, 'username');
    validators.password(newPassword);
    
    // Validate files
    if (!req.files || !Array.isArray(req.files) || req.files.length < 3) {
      return res.status(400).json({ 
        success: false,
        msg: "Three files are required: deposit receipt, ID card selfie, and passbook selfie" 
      });
    }
    
    // Verify each file exists and has appropriate metadata
    req.files.forEach((file, index) => {
      validators.requiredFile(file, `File ${index + 1}`);
      
      // Verify file size is within expected range
      if (file.size < 1024) { // Less than 1KB is suspicious
        throw new Error(`File ${index + 1} is too small to be valid`);
      }
    });
    
    const hashPassword = bcrypt.hashSync(newPassword, 10);
    const uploadedFilesUser = req.files.map((file) => (`/uploads/${file.filename}`));
    
    // Check if user exists before update
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(404).json({ 
        success: false,
        msg: "User not found" 
      });
    }
    
    const updateUser = await User.findOneAndUpdate(
      { username: username },
      { 
        password: hashPassword, 
        plainPassword: newPassword, // Consider removing plainPassword storage for security
        depositReciptProof: uploadedFilesUser[0] || '',
        selfieIdCard: uploadedFilesUser[1] || '',
        selfiePassBook: uploadedFilesUser[2] || '',
        lastPasswordChange: new Date(),
      },
      { new: true }
    );
    
    if (!updateUser) {
      return res.status(500).json({ 
        success: false,
        msg: "Failed to update user" 
      });
    }
    
    const uploadedFiles = req.files.map(file => ({
      filename: file.filename,
      path: `/uploads/${file.filename}`,
      size: file.size
    }));
    
    return res.status(201).json({
      msg: "User Updated",
      updatedDoc: updateUser,
      success: true,
      message: 'Files uploaded successfully',
      files: uploadedFiles
    });
  } catch (error) {
    logError("ChangePasswordtwo", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};

/**
 * Creates a retrieval ticket with file upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
const retriveIdPost = async (req, res) => {
  try {
    // Validate request body
    validateRequestBody(req);
    
    // Sanitize inputs
    const sanitizedBody = sanitizeObject(req.body);
    const { bankAccountNumber, ifscCode, GameId, email } = sanitizedBody;
    
    if (!bankAccountNumber || !ifscCode || !GameId || !email) {
      return res.status(400).json({ 
        success: false,
        msg: "Bank account number, IFSC code, Game ID, and email are required" 
      });
    }
    
    // Validate file
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        msg: "Deposit receipt image is required" 
      });
    }
    
    // Validate file properties
    validators.requiredFile(req.file, 'Deposit receipt');
    
    // Advanced validations
    validators.accountNumber(bankAccountNumber);
    validators.ifscCode(ifscCode);
    validators.gameId(GameId);
    validators.email(email);
    
    // Check for existing ticket with same details
    const existingTicket = await Retrive.findOne({ 
      bankAccountNumber, 
      GameId, 
      email 
    });
    
    if (existingTicket) {
      return res.status(409).json({ 
        success: false,
        msg: "A ticket with these details already exists" 
      });
    }
    
    const newRetrive = new Retrive({ 
      bankAccountNumber, 
      ifscCode, 
      GameId, 
      email,
      depositReceiptImage: `/upload/${req.file.filename}`,
      createdAt: new Date(),
      status: 'pending', // Add initial status
      ipAddress: req.ip || req.connection.remoteAddress // Track IP for security
    });
    
    const createNewRetrive = await Retrive.create(newRetrive);
    
    if (!createNewRetrive) {
      return res.status(500).json({ 
        success: false,
        msg: "Failed to create retrieval ticket" 
      });
    }
    
    return res.status(201).json({ 
      msg: "Retrive Ticket Created!",
      success: true,
      message: 'File uploaded successfully',
      ticketId: createNewRetrive._id,
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error) {
    logError("retriveIdPost", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};

/**
 * Creates a game problem ticket with file upload
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response
 */
const gameProblemPost = async (req, res) => {
  try {
    // Validate request body
    validateRequestBody(req);
    
    // Sanitize inputs
    const sanitizedBody = sanitizeObject(req.body);
    const { issue, gameId } = sanitizedBody;
    
    if (!issue || !gameId) {
      return res.status(400).json({ 
        success: false,
        msg: "Issue description and game ID are required" 
      });
    }
    
    // Validate file
    if (!req.file) {
      return res.status(400).json({ 
        success: false,
        msg: "Issue image is required" 
      });
    }
    
    // Validate file properties
    validators.requiredFile(req.file, 'Issue image');
    
    // Advanced validations
    const sanitizedIssue = validators.string(issue, 'issue');
    validators.gameId(gameId);
    
    // Validate issue description length
    if (sanitizedIssue.length < 10 || sanitizedIssue.length > 500) {
      return res.status(400).json({ 
        success: false,
        msg: "Issue description must be between 10 and 500 characters" 
      });
    }
    
    // Check for duplicate issue from same user/game within short time (spam prevention)
    const recentTicket = await GameProblem.findOne({
      gameId: gameId,
      createdAt: { $gte: new Date(Date.now() - 60 * 60 * 1000) } // Last hour
    });
    
    if (recentTicket) {
      return res.status(429).json({ 
        success: false,
        msg: "You've already submitted a problem for this game recently. Please wait before submitting another." 
      });
    }
    
    const newGameProblem = new GameProblem({
      issue: sanitizedIssue,
      gameId,
      issueImage: `/uploads/${req.file.filename}`,
      createdAt: new Date(),
      status: 'open',
      ipAddress: req.ip || req.connection.remoteAddress,
      userAgent: req.headers['user-agent'] || 'unknown'
    });
    
    const createGameProblem = await GameProblem.create(newGameProblem);
    
    if (!createGameProblem) {
      return res.status(500).json({ 
        success: false,
        msg: "Failed to create game problem ticket" 
      });
    }
    
    return res.status(201).json({ 
      msg: "Game Problem Ticket Created!",
      success: true,
      message: 'File uploaded successfully',
      ticketId: createGameProblem._id,
      file: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`,
        size: req.file.size
      }
    });
  } catch (error) {
    logError("gameProblemPost", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};

/**
 * Retrieves all game problem tickets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with game problem data
 */
const gameProblem = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid pagination parameters" 
      });
    }
    
    const skip = (page - 1) * limit;
    
    // Add filters if provided
    const filters = {};
    
    if (req.query.status) {
      filters.status = validators.string(req.query.status, 'status');
    }
    
    if (req.query.gameId) {
      filters.gameId = validators.gameId(req.query.gameId);
    }
    
    // Count total records for pagination info
    const totalRecords = await GameProblem.countDocuments(filters);
    
    const response = await GameProblem.find(filters)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);
    
    if (!response || response.length === 0) {
      return res.status(404).json({ 
        success: false,
        msg: "No game problem tickets found" 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      GameProblemData: response,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit)
      }
    });
  } catch (error) {
    logError("gameProblem", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};

/**
 * Retrieves all retrieval tickets
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<Object>} JSON response with retrieval tickets
 */
const retriveID = async (req, res) => {
  try {
    // Add pagination support
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1 || limit < 1 || limit > 100) {
      return res.status(400).json({ 
        success: false,
        msg: "Invalid pagination parameters" 
      });
    }
    
    const skip = (page - 1) * limit;
    
    // Add filters if provided
    const filters = {};
    
    if (req.query.status) {
      filters.status = validators.string(req.query.status, 'status');
    }
    
    if (req.query.email) {
      filters.email = validators.email(req.query.email);
    }
    
    // Count total records for pagination info
    const totalRecords = await Retrive.countDocuments(filters);
    
    // Get records with pagination
    const response = await Retrive.find(filters)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skip)
      .limit(limit);
    
    if (!response || response.length === 0) {
      return res.status(404).json({ 
        success: false,
        msg: "No retrieval tickets found" 
      });
    }
    
    return res.status(200).json({ 
      success: true,
      retrivalTickets: response,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages: Math.ceil(totalRecords / limit)
      }
    });
  } catch (error) {
    logError("retriveID", error);
    return res.status(400).json({ 
      success: false,
      msg: "Error: " + error.message 
    });
  }
};

module.exports = {
  upload,
  ChangePasswordtwo,
  retriveIdPost,
  gameProblemPost,
  gameProblem,
  retriveID,
  ChangePasswordOne
};