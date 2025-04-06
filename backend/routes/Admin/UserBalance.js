const UserModel = require('../../models/userModel')
const User = require('../../models/userModel')
const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const {isAdmin,isNormal,} = require("../../middlewares/roleSpecificMiddleware");


router.get('/UserBalance', auth,  async(req,res)=>{
    try {
        const User = await UserModel.find()

        let Userbalance = 0 
        for(let i=0;i<User.length;i++){
            Userbalance += User[i].walletAmount
        }
    res.status(200).json({
        success: true,
        message:"User Balance",
        UserBalance:Userbalance
    })

    } catch (error) {
        res.status(500).json({
            success: false,
            message:"Internal issues"
        })
    }
})
router.patch('/toggle-wallet-hold', auth, isAdmin, async (req, res) => {
    try {
        const { uid, status, holdAmount } = req.body;

        // Validate required fields
        if (!uid) {
            return res.status(400).json({
                success: false,
                message: 'User ID (uid) is required'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Status must be a boolean value'
            });
        }

        // Convert holdAmount to a number
        const holdAmountNumber = Number(holdAmount);

        // Validate holdAmount when locking wallet
        if (status && (isNaN(holdAmountNumber) || holdAmountNumber < 0)) {
            return res.status(400).json({
                success: false,
                message: 'Valid holdAmount is required when locking wallet'
            });
        }

        const updateData = {
            isWalletOnHold: status,
            holdAmount: status ? holdAmountNumber : 0 // Reset holdAmount to 0 when unlocking
        };

        const user = await User.findOneAndUpdate(
            { uid: uid },
            updateData,
            { new: true }
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: `Wallet ${status ? 'locked' : 'unlocked'} successfully`,
            isWalletOnHold: user.isWalletOnHold,
            holdAmount: user.holdAmount
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
});

module.exports = router