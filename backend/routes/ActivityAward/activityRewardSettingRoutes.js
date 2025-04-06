const express = require('express');
const router = express.Router();
const activityRewardController = require('../../controllers/activityRewardSettingController');
const auth = require('../../middlewares/auth');
const User = require("../../models/userModel")
const {isAdmin} = require("../../middlewares/roleSpecificMiddleware")
const ActivityRewardSetting = require("../../models/ActivityRewardSetting")
// Create a new setting
router.post('/',auth,isAdmin,activityRewardController.createSetting);

// Get all settings
router.get('/',auth,activityRewardController.getAllSettings);

// Update a setting by ID
router.put('/:id',auth,isAdmin,activityRewardController.updateSetting);

// Delete a setting by ID
router.delete('/:id',auth,isAdmin, activityRewardController.deleteSetting);

// Claim an activity reward
router.post('/activity-reward-claim', auth, activityRewardController.claimReward);

// Get user's claimed rewards for today
router.get('/user/claimed-rewards', auth, activityRewardController.getClaimedRewards);

// Route to get rewards based on period
router.get('/rewards-by-period/:period',auth, activityRewardController.getRewardsByPeriod);


module.exports = router;