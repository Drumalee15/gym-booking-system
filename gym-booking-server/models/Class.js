const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  schedule: {
    type: Date,
    required: true,
  },
  instructor: {
    type: String,
    required: true,
  },
  capacity: {
    type: Number,
    required: true,
  },
  booked: {
    type: Number,
    default: 0,
  },
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
    },
  ],
});

module.exports = mongoose.model("Class", ClassSchema);
