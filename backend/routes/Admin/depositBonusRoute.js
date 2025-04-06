const express = require('express');
const { updateDepositBonus, getAllDepositBonuses,getAllSecondDepositBonuses,updateSecondDepositBonus,deleteDepositBonus,deleteSecondDepositBonus  } = require('../../controllers/depositBonusController');

const router = express.Router();

router.put('/admin/update-deposit-bonus', updateDepositBonus);
router.get('/all-deposit-bonuses', getAllDepositBonuses);
router.get('/all-second-deposit-bonuses', getAllSecondDepositBonuses);
router.put('/admin/update-second-deposit-bonus', updateSecondDepositBonus);
router.delete('/deposit-bonus', deleteDepositBonus);
router.delete('/second-deposit-bonus', deleteSecondDepositBonus);


module.exports = router;