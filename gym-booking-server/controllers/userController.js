const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const CryptoJS = require("crypto-js");
const User = require("../models/User");
const Booking = require("../models/Booking");
require("dotenv").config();

// Register User
exports.registerUser = async (req, res) => {
  const { data } = req.body;
  try {
    const bytes = CryptoJS.AES.decrypt(data, "your_secret_key");
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { username, email, password } = decryptedData;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({
      username,
      email,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    await user.save();

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Login User
exports.loginUser = async (req, res) => {
  const { data } = req.body;
  try {
    const bytes = CryptoJS.AES.decrypt(data, "your_secret_key");
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

    const { email, password } = decryptedData;

    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "5h" },
      (err, token) => {
        if (err) throw err;
        res.json({ token });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get User Profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Update User Profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { genderIdentity, birthday, height, weight, location, username } =
      req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.genderIdentity = genderIdentity || user.genderIdentity;
    user.birthday = birthday || user.birthday;
    user.height = height || user.height;
    user.weight = weight || user.weight;
    user.location = location || user.location;
    user.username = username || user.username;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get User Bookings
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id });
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
