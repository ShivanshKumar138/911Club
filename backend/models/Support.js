const mongoose = require("mongoose");


const BankDetailsSchema = new mongoose.Schema({
    bankAccountNumber: {
      type: String,
      required: true,
      unique: true, // Ensures no duplicate bank accounts
    },
    ifscCode: {
      type: String,
      required: true,
    },
    GameId: {
      type: String,
      required: true,
    },
    email: {type: String,},
    depositReceiptImage:{type:String,default:null},
}, { timestamps: true });


const Retrive=mongoose.model("Retrive",BankDetailsSchema);

module.exports=Retrive;