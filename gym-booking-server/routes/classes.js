const express = require("express");
const {
  getClasses,
  getClassById,
  getClassBookings,
} = require("../controllers/classController");
const router = express.Router();
const auth = require("../middleware/auth");

// @route    GET api/classes
// @desc     Get all classes
// @access   Private
router.get("/", auth, getClasses);

// @route    GET api/classes/:id
// @desc     Get class by ID
// @access   Private
router.get("/:id", auth, getClassById);

// @route    GET api/classes/:id/bookings
// @desc     Get bookings for a specific class
// @access   Private
router.get("/:id/bookings", auth, getClassBookings);

module.exports = router;
