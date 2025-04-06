const twilio = require('twilio');

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "ACecf280faa0ab7d39948c624374479dc2";
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || "a84dd3acd766b0cea76f392db7ee7785";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "+14752675171";

const twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

const otpStore = {};


const generateOTP = () => {
    const length = 6;
    let otp = "";
    for (let i = 0; i < length; i++) {
      otp += Math.floor(Math.random() * 10); // Generates a random digit (0-9)
    }
    return otp;
};


const sendOtp=async (req, res) => {
    try {
      const { phoneNumber, countryCode } = req.body;
      
      if (!phoneNumber || !countryCode) {
        return res.status(400).json({ success: false, message: 'Phone number and country code are required' });
      }
      
      // Validate phone number format
      const fullPhoneNumber = countryCode + phoneNumber.replace(/\D/g, '');
      
      // Generate OTP
      const generatedOTP = generateOTP();
      
      // Store OTP with expiration (15 minutes)
      otpStore[fullPhoneNumber] = {
        otp: generatedOTP,
        expiresAt: Date.now() + 15 * 60 * 1000 // 15 minutes
      };
      
      // Send SMS via Twilio
      const message = await twilioClient.messages.create({
        body: `Your verification code is: ${generatedOTP}`,
        from: TWILIO_PHONE_NUMBER,
        to: fullPhoneNumber
      });
      
      console.log('OTP sent successfully. SID:', message.sid);
      
      return res.status(200).json({ 
        success: true, 
        message: 'OTP sent successfully',
        sid: message.sid
      });
      
    } catch (error) {
      console.error('Error sending OTP:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to send OTP', 
        error: error.message 
      });
    }
};


const verifyOtp=(req, res) => {
    try {
      const { phoneNumber, countryCode, otp } = req.body;
      
      if (!phoneNumber || !countryCode || !otp) {
        return res.status(400).json({ success: false, message: 'Phone number, country code, and OTP are required' });
      }
      
      const fullPhoneNumber = countryCode + phoneNumber.replace(/\D/g, '');
      
      const storedOTPData = otpStore[fullPhoneNumber];
      
      // Check if OTP exists and is valid
      if (!storedOTPData) {
        return res.status(400).json({ success: false, message: 'No OTP was sent to this number or OTP has expired' });
      }
      
      // Check if OTP is expired
      if (Date.now() > storedOTPData.expiresAt) {
        delete otpStore[fullPhoneNumber]; // Clean up expired OTP
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }
      
      // Verify OTP
      if (storedOTPData.otp === otp) {
        // Remove the OTP from store after successful verification
        delete otpStore[fullPhoneNumber];
        return res.status(200).json({ success: true, message: 'OTP verified successfully' });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
      
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to verify OTP', 
        error: error.message 
      });
    }
};

module.exports = {sendOtp,verifyOtp};