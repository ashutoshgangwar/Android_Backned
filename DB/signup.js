const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

const signupSchema = new mongoose.Schema({
  fullname: String,
  email: String,
  phonenumber: Number,
  password: { type: String, required: true },
  name: String,
  gender:String,
  age: Number,
  dob: String,
  city: String,
  state: String,
  gametype: String,
  game: {
    type: [String], // Change from String to [String] to allow an array
    required: true
},
  gamestage: String,
  registeras: String,
  instname:String,
  headname:String,
  heademail:String,
  headphone:Number,
  ptteachername:String,
  ptteacheremail:String,
  ptteacherphone:Number,
  address:String,
  profilePic: String // Field for storing the profile image URL
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
