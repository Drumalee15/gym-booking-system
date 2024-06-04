const express = require("express");
const {
  getBookings,
  createBooking,
} = require("../controllers/bookingController");
const router = express.Router();
const auth = require("../middleware/auth");

// @route    GET api/bookings
// @desc     Get all bookings of a user
// @access   Private
router.get("/", auth, getBookings);

// @route    POST api/bookings
// @desc     Create a booking
// @access   Private
router.post("/", auth, createBooking);

module.exports = router;
