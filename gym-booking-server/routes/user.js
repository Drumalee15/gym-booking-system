const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  getUserBookings,
  updateUserProfile, // Add this line
} = require("../controllers/userController");
const auth = require("../middleware/auth");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/profile", auth, getUserProfile);
router.put("/profile", auth, updateUserProfile); // Ensure this line is correct
router.get("/bookings", auth, getUserBookings);

module.exports = router;
