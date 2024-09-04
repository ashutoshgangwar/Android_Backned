const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phonenumber: Number,
  password:String
  
},

{ collection: 'signup' } 

  );

  module.exports = mongoose.model("signup", userSchema);

  