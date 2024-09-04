const express = require("express");
const cors = require("cors");
require("./DB/config");
const User = require("./DB/users");
const Signup = require("./DB/signup"); // Corrected model name


const app = express();

app.use(express.json());
app.use(cors());

// Userdata API
app.post("/userdata", async (req, resp) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  try {
    let user = new User(req.body);
    let result = await user.save();
    resp.send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// SIGNUP API
app.post("/signup", async (req, resp) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  try {
    let user = new Signup(req.body); // Corrected model name
    let result = await user.save();
    resp.send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// Login API
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

    resp.send({ message: 'Login successful', user });
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});


app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
