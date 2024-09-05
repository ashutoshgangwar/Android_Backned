const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("./DB/config");
const Signup = require("./DB/signup");
const User = require("./DB/userdetails")



const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_secret_key';

// SIGNUP API
app.post("/signup", async (req, resp) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  try {
    let user = new Signup(req.body);
    let result = await user.save();
    resp.status(201).send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// LOGIN API
app.post("/login", async (req, resp) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  
  const { email, password } = req.body;

  try {
    const user = await Signup.findOne({ email });

    if (!user) {
      return resp.status(401).send({ error: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return resp.status(401).send({ error: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    resp.send({ message: 'Login successful', token, user });
    
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// USERDATA API
app.post("/userdata", async (req, resp) => {
  try {
    let user = new User(req.body); // Save userdata as a Signup entry
    let result = await user.save();
    resp.status(201).send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// PROFILE API (Using the Signup schema to fetch profile data)
app.get("/profile/:id", async (req, res) => {
  try {
    const profiles = await Signup.findById(req.params.id); // Fetch all users from signup collection
    res.json(profiles);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Server Listening
app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
