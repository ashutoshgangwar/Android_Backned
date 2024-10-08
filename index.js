const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require('path');
require("./DB/config");
const Signup = require("./DB/signup");
const User = require("./DB/userdetails");

const app = express();

app.use(express.json());
app.use(cors());

const JWT_SECRET = 'your_secret_key';

// SIGNUP API
app.post("/signup", async (req, resp) => {
  try {
    let user = new Signup(req.body);
    let result = await user.save();
    resp.status(201).send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});


// CHECK EMAIL API
app.get("/check-email", async (req, res) => {
  const { email } = req.query; // Get the email from the query parameters

  if (!email) {
    return res.status(400).json({ message: "Email is required" });
  }

  try {
    const user = await Signup.findOne({ email });

    if (user) {
      return res.status(200).json({ exists: true }); // Email exists
    } else {
      return res.status(200).json({ exists: false }); // Email does not exist
    }
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});



// LOGIN API
app.post("/login", async (req, resp) => {
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

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    resp.send({ message: 'Login successful', token, userId: user._id });
    
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// USERDATA API
app.post("/userdata", async (req, resp) => {
  const token = req.headers.authorization?.split(" ")[1]; 

  if (!token) {
    return resp.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;
    const userdata = { ...req.body, userId };

    let user = new User(userdata); 
    let result = await user.save();
    resp.status(201).send(result);
  } catch (error) {
    console.error('Error while saving user data:', error.message);
    resp.status(500).send({ error: error.message });
  }
});

// FETCH USERDATA API
app.get("/userdata", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const userData = await User.findOne({ userId }).select("-password");
    if (!userData) {
      return res.status(404).json({ message: "User data not found" });
    }

    res.json(userData);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// PROFILE API
app.get("/profile", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.userId;

    const profile = await Signup.findById(userId).select("-password");
    if (!profile) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(profile);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/profilePics/',
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// Initialize upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  }
}).single('profilePic');

// Check file type
function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Error: Images Only!');
  }
}

// Update Profile Picture API
app.put("/profile/pic", (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  jwt.verify(token, JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ message: err });
      }

      try {
        const user = await Signup.findById(decoded.userId);
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }

        user.profilePic = `/uploads/profilePics/${req.file.filename}`;
        await user.save();
        res.status(200).json({ message: "Profile picture updated successfully", profilePic: user.profilePic });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  });
});

// Serve static files from the uploads folder
app.use('/uploads', express.static('uploads'));

app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
