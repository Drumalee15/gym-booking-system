const Booking = require("../models/Booking");
const Class = require("../models/Class");
const User = require("../models/User");

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate(
      "class"
    );
    res.json(bookings);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.createBooking = async (req, res) => {
  const { classId } = req.body;

  try {
    const cls = await Class.findById(classId);
    if (!cls) {
      return res.status(404).json({ msg: "Class not found" });
    }

    if (cls.booked >= cls.capacity) {
      return res.status(400).json({ msg: "Class is fully booked" });
    }

    const existingBooking = await Booking.findOne({
      user: req.user.id,
      class: classId,
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ msg: "You have already booked this class" });
    }

    const booking = new Booking({
      user: req.user.id,
      class: classId,
    });

    await booking.save();

    cls.booked += 1;
    await cls.save();

    res.json(booking);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

exports.getClassDetailsByDate = async (req, res) => {
  try {
    const classId = req.params.id;
    const date = req.query.date;

    // Fetch the class details based on the class ID and date
    const classDetails = await Class.findById(classId);

    if (!classDetails) {
      return res.status(404).json({ message: "Class not found" });
    }

    // You can add additional logic here to filter by date if needed
    // For example, filtering bookings based on the date
    // const filteredBookings = classDetails.bookings.filter(booking => booking.date === date);

    res.json(classDetails);
  } catch (err) {
    console.error("Server error:", err.message);
    res.status(500).send("Server error");
  }
};
