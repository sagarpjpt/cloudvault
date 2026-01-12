const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userModel = require("../models/user.model");
require("dotenv").config();

// REGISTER
exports.register = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const existingUser = await userModel.findUserByEmail(email);
    if (existingUser.rows.length > 0) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await userModel.createUser(email, hashedPassword, name);

    res.status(201).json({
      message: "User registered successfully",
      user: result.rows[0],
      success: true,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await userModel.findUserByEmail(email);
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({
      message: "Login successful",
      token,
      success: true,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error" + err.message });
  }
};

// GET CURRENT USER
exports.me = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await userModel.findUserById(userId);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json({ success: true, user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: "Server error", success: false });
  }
};

// LOGOUT
exports.logout = (req, res) => {
  // clear cookie(that contains jwt toke) if using it else if token sent as res body and stored in client side local storage so just delete it from client sidde
  // i am sending token in res body and recieve at server via auth header
  res.json({ success: true, message: "Logged out successfully" });
};
