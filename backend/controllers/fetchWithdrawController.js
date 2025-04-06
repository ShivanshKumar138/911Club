const Withdraw = require("../models/withdrawModel");
const User = require("../models/userModel");

// exports.fetchWithdrawController = async (req, res) => {
//   try {
//     const user = req.user._id;
//     const { startDate, endDate } = req.query;

//     console.log("=== Fetch Withdraw Controller ===");
//     console.log(`- User ID: ${user}`);
//     console.log(
//       `- Query Params - Start Date: ${startDate}, End Date: ${endDate}`
//     );

//     const userDetails = await User.findById(user);
//     console.log(
//       `- User Details Fetched - Account Type: ${
//         userDetails.accountType
//       }, User: ${userDetails.name || userDetails.email}`
//     );

//     let query = {};
//     if (startDate && endDate) {
//       query.createdAt = {
//         $gte: new Date(startDate),
//         $lte: new Date(endDate),
//       };
//       console.log(`- Date filter applied: From ${startDate} to ${endDate}`);
//     } else {
//       console.log("- No date filter applied");
//     }

//     if (userDetails.accountType !== "Admin") {
//       query.userId = user;
//       console.log(`- Restricting query to user ID: ${user}`);
//     } else {
//       console.log("- Admin user, fetching all withdrawals");
//     }

//     // Fetch withdrawals based on the query
//     const withdrawals = await Withdraw.find(query)
//       .sort({ _id: -1 })
//       .populate("userId", "bankDetails TRXAddress");

//     console.log(`- Withdrawals fetched from DB: ${withdrawals.length}`);

//     // Filter withdrawals where userId's accountType is not 'Restricted'
//     const filteredWithdrawals = [];
//     for (const withdrawal of withdrawals) {
//       const withdrawalUser = await User.findById(withdrawal.userId);
//       if (withdrawalUser) {
//         console.log(
//           `-- Processing withdrawal ID: ${withdrawal._id}, User ID: ${withdrawalUser._id}, Account Type: ${withdrawalUser.accountType}`
//         );
//       } else {
//         console.log(`--- User not found for Withdrawal ID: ${withdrawal._id}`);
//         continue;
//       }

//       // Only include withdrawals where the accountType is NOT 'Restricted'
//       if (withdrawalUser.accountType !== "Restricted") {
//         filteredWithdrawals.push(withdrawal);
//         console.log(`--- Withdrawal added to filtered list`);
//       } else {
//         console.log(`--- Withdrawal skipped due to Restricted account type`);
//       }
//     }

//     console.log(`- Filtered Withdrawals count: ${filteredWithdrawals.length}`);

//     // Respond with the filtered list of withdrawals
//     res.status(200).json({
//       success: true,
//       userWithdrawals: filteredWithdrawals,
//     });
//   } catch (error) {
//     console.error("Error in fetchWithdrawController:", error);
//     res.status(500).json({
//       message: "Error fetching withdrawal data",
//       error: error.message,
//     });
//   }
// };

exports.fetchWithdrawController = async (req, res) => {
  try {
    const user = req.user._id;
    const { startDate, endDate } = req.query;

    console.log("=== Fetch Withdraw Controller ===");
    console.log(`- User ID: ${user}`);
    console.log(
      `- Query Params - Start Date: ${startDate}, End Date: ${endDate}`
    );

    const userDetails = await User.findById(user);
    const withdrawId = await Withdraw.findOne({ userId: user });
    console.log(
      `- User Details Fetched - Account Type: ${
        userDetails.accountType
      }, User: ${userDetails.name || userDetails.email}`
    );

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
      console.log(`- Date filter applied: From ${startDate} to ${endDate}`);
    } else {
      console.log("- No date filter applied");
    }

    if (userDetails.accountType !== "Admin") {
      query.userId = user;
      console.log(`- Restricting query to user ID: ${user}`);
    } else {
      console.log("- Admin user, fetching all withdrawals");
    }

    // Fetch withdrawals based on the query
    const withdrawals = await Withdraw.find(query)
      .sort({ _id: -1 })
      .populate("userId", "bankDetails TRXAddress uid");

    console.log(`- Withdrawals fetched from DB: ${withdrawals.length}`);

    // Filter withdrawals where userId's accountType is not 'Restricted'
    const filteredWithdrawals = [];
    for (const withdrawal of withdrawals) {
      const withdrawalUser = await User.findById(withdrawal.userId);
      if (withdrawalUser) {
        console.log(
          `-- Processing withdrawal ID: ${withdrawal._id}, User ID: ${withdrawalUser._id}, Account Type: ${withdrawalUser.accountType}`
        );
      } else {
        console.log(`--- User not found for Withdrawal ID: ${withdrawal._id}`);
        continue;
      }

      // Only include withdrawals where the accountType is NOT 'Restricted'
      if (withdrawalUser.accountType !== "Restricted") {
        filteredWithdrawals.push({
          ...withdrawal.toObject(),
          userUid: withdrawalUser.uid,
          orderNumber: withdrawId._id,
        });
        console.log(`--- Withdrawal added to filtered list`);
      } else {
        console.log(`--- Withdrawal skipped due to Restricted account type`);
      }
    }

    console.log(`- Filtered Withdrawals count: ${filteredWithdrawals.length}`);

    // Respond with the filtered list of withdrawals
    res.status(200).json({
      success: true,
      userWithdrawals: filteredWithdrawals,
    });
  } catch (error) {
    console.error("Error in fetchWithdrawController:", error);
    res.status(500).json({
      message: "Error fetching withdrawal data",
      error: error.message,
    });
  }
};

exports.fetchWithdrawUserController = async (req, res) => {
  try {
    const user = req.user._id;
    const { startDate, endDate } = req.query;

    console.log("Fetch Withdraw Controller");
    console.log("- User ID:", user);
    console.log("- Start Date:", startDate);
    console.log("- End Date:", endDate);

    const userDetails = await User.findById(user);
    console.log("- User Account Type:", userDetails.accountType);

    let query = {};
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (userDetails.accountType !== "Admin") {
      query.userId = user;
    }

    const userWithdrawals = await Withdraw.find(query)
      .sort({ _id: -1 })
      .populate("userId", "bankDetails TRXAddress");

    console.log("Withdrawals found:", userWithdrawals.length);

    res.status(200).json({
      success: true,
      userWithdrawals,
    });
  } catch (error) {
    console.error("Error in fetchWithdrawController:", error);
    res.status(500).json({
      message: "Error fetching withdrawal data",
      error: error.message,
    });
  }
};
