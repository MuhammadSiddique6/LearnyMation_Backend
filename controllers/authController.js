const Auth = require('../models/auth');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const User = require('../models/user');
const SECRET_KEY = process.env.SECRET_KEY;

exports.signup = async (req, res) => {
  
  const { name, email, password } = req.body;
const emailOk = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.(com)$/i.test(email);

  // 2) password: ≥8 chars, ≥1 uppercase, ≥1 digit, ≥1 special
  const pwdOk = /^(?=.*[A-Z])(?=.*\d)(?=.*[^\w\s]).{8,}$/.test(password);

  if (!emailOk) {
    return res
      .status(400)
      .json({ message: "Email must contain '@' and end with '.com'." });
  }
  if (!pwdOk) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and include an uppercase letter, a number, and a special character.",
    });
  }
  try {
    const existemail = await Auth.findOne({ email });
    if (existemail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Auth({
      name,
      email,
      password: hashedPassword,
    
    });
     const newUsers = new User({
      name,
      email,    
    });
    await newUser.save();
        await newUsers.save();

    res.status(200).json({ message: "User Account Successfully created" });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ message: "Error during signup"});
  }
};

exports.signin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
  { userId: user._id, email: user.email },
  process.env.SECRET_KEY,
  { expiresIn: "1d" }
);

// Save it in DB
user.token = token;
await user.save();

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error logging in user", error: error.message });
  }
};
