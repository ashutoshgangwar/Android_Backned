const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    weightt: Number,
    height: Number,
    bloodgroup: String,
    diet: String,
    userId:String
},

{ collection: 'users' } 

  );

  module.exports = mongoose.model("users", userSchema);

  