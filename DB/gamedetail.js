const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    gamename: String,
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

  