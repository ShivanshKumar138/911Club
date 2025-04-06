const Withdraw = require("../models/withdrawModel");

exports.getTotalWithdrawAmountToday = async (req, res, next) => {
  try {
    // Get today's date in YYYY-MM-DD format
    const today = new Date();
    const todayDateString = today.toISOString().split('T')[0];

    const totalWithdrawAmount = await Withdraw.aggregate([
      {
        $match: {
          $expr: {
            $and: [
              { $eq: [{ $substr: ["$createdAt", 0, 10] }, todayDateString] },
              { $eq: ["$status", "Completed"] }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$balance" }
        }
      }
    ]);

    const total = totalWithdrawAmount.length > 0 ? totalWithdrawAmount[0].total : 0;
    res.json({ totalWithdrawAmount: total });
  } catch (error) {
    next(error);
  }
};

exports.getPendingWithdrawCount = async (req, res, next) => {
  try {
    // Count the number of pending withdrawal requests
    const pendingWithdrawals = await Withdraw.countDocuments({
      status: "Pending", // Adjust this status value based on your schema
    });

    res.status(200).json({
      success: true,
      message: "Pending withdrawals count fetched successfully",
      pendingWithdrawCount: pendingWithdrawals,
    });
  } catch (error) {
    next(error);
  }
};