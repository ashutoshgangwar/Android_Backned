const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    formNumber:String,
    gametype: String,
    gamename: {
    type: [String], // Change from String to [String] to allow an array
    required: true
},
    gamelevel:String,
    agegroup:Number,
    venue:String,
    date:String,
    time:String,
    details:String,
    imageUrl: String,

},

{ collection: 'gamedetail' } 

  );

  module.exports = mongoose.model("Game", userSchema);

  