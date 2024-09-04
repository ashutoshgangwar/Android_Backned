const mongoose = require("mongoose");

const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phonenumber: Number,
  password: { type: String, required: true }
}, { collection: 'signup' });

// Hash the password before saving
userSchema.pre('save', async function(next) {
  if (this.isModified('password') || this.isNew) {
    this.password = await bcrypt.hash(this.password, 8);
  }
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("signup", userSchema);
