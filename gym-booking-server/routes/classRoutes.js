const express = require("express");
const router = express.Router();
const Class = require("../models/Class");
const { getClassDetailsByDate } = require("../controllers/bookingController");

// API endpoint to get all classes
router.get("/", async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

// API endpoint to get class details by date
router.get("/:id/details", getClassDetailsByDate);

// @route    POST api/classes/:id/book
// @desc     Book a class
// @access   Private
router.post("/:id/book", auth, bookClass);

module.exports = router;
