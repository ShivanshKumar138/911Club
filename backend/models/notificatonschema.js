const mongoose = require('mongoose')

const Notification = mongoose.Schema({
    title:{type:String, required:true},
    message:{type:String, required:true},
    date:{type:Number, default:Date.now},
    global: { type: Boolean, default: false },
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
      // Add remark field
  remark: String,
})

const notify = mongoose.model("notify", Notification);

module.exports = notify;