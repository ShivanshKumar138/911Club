const express = require("express");
const router = express.Router();
const user = require("../../models/userModel");
const auth = require("../../middlewares/auth");
const {isAdmin,isNormal,isRestricted,} = require("../../middlewares/roleSpecificMiddleware");

router.get("/all-users", auth, async(req, res) => {
    try{
        const userDetails = await user.find();
        const users = [];
        if(userDetails.length > 0){
            const count = userDetails.length;
            for (let i=0; i<count; i++){
                users.push({
                    email:userDetails[i].email,
                    username:userDetails[i].username,
                    registrationDate:userDetails[i].registrationDate,
                    role:userDetails[i].role,
                    walletAmount:userDetails[i].walletAmount,
                })
            }
        } else {
            console.log("No user found in the DB");
        }
    res.status(200).json({
        user:users,
        success:true,
        message:"data fetched succesfully"
    })
    }catch(error){
        res.status(500).json({
            error:error.message,
            success:false,
            message:"internal issues"
        })
    }
})


// Route to get user subordinate data including commissions and all details
router.get('/user/subordinatedata', auth, async (req, res) => {
    try {
      // Find the user by ID and select relevant fields
      const userData = await user.findById(req.user._id).select('directSubordinates teamSubordinates commissionRecords referredUsers');
  
      if (!userData) {
        return res.status(404).send('User not found');
      }
  
      // Structure the response data
      const responseData = {
        directSubordinates: userData.directSubordinates,
        teamSubordinates: userData.teamSubordinates,
        commissionRecords: userData.commissionRecords,
        referredUsers: userData.referredUsers
      };
  
      res.send(responseData);
    } catch (err) {
      res.status(500).send(err.message);
    }
  });
  
  
module.exports =  router;