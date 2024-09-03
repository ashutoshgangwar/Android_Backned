const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  age: Number,
  city: String,
  state: String
},

{ collection: 'users' } 

);

 

module.exports = mongoose.model("users", userSchema);
