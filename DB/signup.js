const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const signupSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phonenumber: Number,
  password: { type: String, required: true },
  name: String, // Add these fields for profile info
  age: Number,
  DOB: Number,
  city: String,
  location: String,
  gametype: String,
  game: String,
  gamestage: String
}, { collection: 'signup' });

// Hash the password before saving
signupSchema.pre('save', async function (next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare passwords
signupSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("signup", signupSchema);
