const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("./DB/config");
const Signup = require("./DB/signup");
const User = require("./DB/userdetails");

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

// USERDATA API (Save user data with reference to the logged-in user)
app.post("/userdata", async (req, resp) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return resp.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Add userId to request body
    const userdata = { ...req.body, userId };

    let user = new User(userdata); // Save userdata as a User entry
    let result = await user.save();
    resp.status(201).send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// PROFILE API (Fetch profile data using the JWT token)
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract token from Authorization header

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    // Fetch user profile using the userId from the token
    const profile = await Signup.findById(userId);

    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Server Listening
app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
