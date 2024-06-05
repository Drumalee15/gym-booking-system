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
  const { date } = req.query;
  const startDate = new Date(date);
  const endDate = new Date(date);
  endDate.setDate(startDate.getDate() + 1);

  try {
    const classes = await Class.find({
      schedule: {
        $gte: startDate,
        $lt: endDate,
      },
    });
    res.json(classes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
