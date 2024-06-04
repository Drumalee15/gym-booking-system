const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const router = express.Router();

// @route    POST api/users
// @desc     Register user
// @access   Public
router.post("/register", registerUser);

// @route    POST api/auth
// @desc     Authenticate user & get token
// @access   Public
router.post("/login", loginUser);

module.exports = router;
