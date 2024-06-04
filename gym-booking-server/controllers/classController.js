const Class = require("../models/Class");

// Get all classes
exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(classes);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get class by ID
exports.getClassById = async (req, res) => {
  try {
    const classDetail = await Class.findById(req.params.id);
    if (!classDetail) {
      return res.status(404).json({ msg: "Class not found" });
    }
    res.json(classDetail);
  } catch (err) {
    res.status(500).send("Server error");
  }
};

// Get bookings for a specific class
exports.getClassBookings = async (req, res) => {
  try {
    const classDetail = await Class.findById(req.params.id).populate(
      "bookings"
    );
    if (!classDetail) {
      return res.status(404).json({ msg: "Class not found" });
    }
    res.json(classDetail.bookings);
  } catch (err) {
    res.status(500).send("Server error");
  }
};
