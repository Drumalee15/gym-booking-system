const Class = require("../models/Class");
const Booking = require("../models/Booking");

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(
      classes.map((cls) => ({
        id: cls._id,
        name: cls.name,
        description: cls.description,
        image: cls.image,
        schedule: cls.schedule,
        instructor: cls.instructor,
        capacity: cls.capacity,
        booked: cls.booked,
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getClassById = async (req, res) => {
  try {
    const classDetail = await Class.findById(req.params.id);
    if (!classDetail) {
      return res.status(404).json({ msg: "Class not found" });
    }
    res.json(classDetail);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getClasses = async (req, res) => {
  try {
    const classes = await Class.find();
    res.json(
      classes.map((cls) => ({
        id: cls._id,
        name: cls.name,
        description: cls.description,
        image: cls.image,
        schedule: cls.schedule,
        instructor: cls.instructor,
        capacity: cls.capacity,
        booked: cls.booked,
      }))
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.getClassBookings = async (req, res) => {
  try {
    const classId = req.params.id;
    const date = req.query.date;

    // Fetch class details including bookings
    const classDetails = await Class.findById(classId);
    if (!classDetails) {
      return res.status(404).json({ msg: "Class not found" });
    }

    // Filter bookings based on the provided date (compare only the date part)
    const bookings = classDetails.bookings.filter(
      (booking) => booking.date.split("T")[0] === date
    );

    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.bookClass = async (req, res) => {
  try {
    const classId = req.params.id;
    const classToBook = await Class.findById(classId);

    if (!classToBook) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classToBook.status === "Booked") {
      return res.status(400).json({ message: "Class already booked" });
    }

    classToBook.status = "Booked";
    await classToBook.save();

    res.json(classToBook);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
};
