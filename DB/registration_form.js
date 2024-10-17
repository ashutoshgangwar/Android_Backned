const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    formNumber:String,
    applicationno:String,
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

{ collection: 'registration_form' } 

  );

  module.exports = mongoose.model("Registration_form", userSchema);

  