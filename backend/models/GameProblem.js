const mongoose=require("mongoose");


const GameProblemSchema=new mongoose.Schema({
    gameId: {
        type: String,
        required: true, // gameId is mandatory
        unique: true, // Ensures no duplicate gameId
      },
    issue: {
        type: String,
        required: true,
        maxlength: 600, // Limits issue length to 600 characters
    },
    issueImage:{type:String,default:null},
});

const GameProblem=mongoose.model("GameProblem",GameProblemSchema);

module.exports=GameProblem;