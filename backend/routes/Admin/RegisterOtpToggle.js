const { Router } = require("express");
const RegisterOtpToggleModel = require("../../models/RegisterOtpToggleModel");

const router = Router();

router.put("/register-otp-toggle", async (req, res) => {
  try {
    const { username, isToggle } = req.body;
    const isAlreadyPresent = await RegisterOtpToggleModel.findOne({ username });
    if (!isAlreadyPresent) {
      const newToggle = new RegisterOtpToggleModel({
        username,
        isToggle,
      });
      await RegisterOtpToggleModel.create(newToggle);
      res.status(200).json({ msg: "Register OTP Toggle added for the user" });
    }
    await RegisterOtpToggleModel.findOneAndUpdate({ username }, { isToggle });
    res.status(200).json({ msg: "Register OTP Toggle Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

router.get("/register-otp-toggle", async (req, res) => {
  try {
    const toggle = await RegisterOtpToggleModel.find();
    res.status(200).json(toggle);
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
});

module.exports = router;
