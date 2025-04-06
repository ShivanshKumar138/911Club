const mongoose = require("mongoose");

const withdrawSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
      enum: ["Rejected", "Pending", "Completed"],
    },
    balance: {
      type: Number,
      required: true,
    },
    withdrawMethod: {
      type: String,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    withdrawDone: {
      type: Boolean,
      default: false,
    },
    remark: {
      type: String, 
      default: "", 
    },
  },
  { timestamps: true }
);

const Withdraw = mongoose.model("Withdraw", withdrawSchema);

module.exports = Withdraw;
