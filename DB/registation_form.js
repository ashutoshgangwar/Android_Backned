const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    fullname: String,
    dob: String,
    weight: Number,
    height: Number,
    gender:String,
    bloodgroup: String,
    game:String,
    agegroup:Number,  
    date:String,
    time:String,
    city: String,
    gamelevel:String,
    userId:String
},

{ collection: 'registation_form' } 

  );

  module.exports = mongoose.model("Registation_form", userSchema);

  