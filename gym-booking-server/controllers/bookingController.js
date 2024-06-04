const Booking = require("../models/Booking");
const Class = require("../models/Class");

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
    if (cls.booked >= cls.capacity) {
      return res.status(400).json({ msg: "Class is fully booked" });
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
