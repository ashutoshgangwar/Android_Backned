const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    weight: Number,
    height: Number,
    bloodgroup: String,
    diet: String,
    agegroup:Number,
    gamelevel:String,
    performance:String,
    pcoaching:String,
    coachingplace:String,
    coachingintrest:String,
    userId:String
},

{ collection: 'users' } 

  );

  module.exports = mongoose.model("users", userSchema);

  