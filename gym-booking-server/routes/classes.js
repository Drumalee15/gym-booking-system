const express = require("express");
const { getClasses } = require("../controllers/classController");
const router = express.Router();
const auth = require("../middleware/auth");

// @route    GET api/classes
// @desc     Get all classes
// @access   Private
router.get("/", auth, getClasses);

module.exports = router;
