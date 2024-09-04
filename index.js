const express = require("express");
const cors = require("cors");
require("./DB/config"); 
const User = require("./DB/users");
const signup = require("./DB/signup"); 

const app = express();

app.use(express.json());
app.use(cors());

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


app.post("/signup", async (req, resp) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  try {
    let user = new signup(req.body);
    let result = await user.save();
    resp.send(result);
  } catch (error) {
    console.error('Error:', error.message);
    resp.status(500).send({ error: error.message });
  }
});


// app.post("/userdatas", async (req, resp) => {
//   let user = new User(req.body);
//   let result = await user.save();
//   resp.send(result);
// });

app.listen(6000, () => {
  console.log("Server is running on port 6000");
});
