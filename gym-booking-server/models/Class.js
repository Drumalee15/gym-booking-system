const mongoose = require("mongoose");

const ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  schedule: { type: Date, required: true },
  capacity: { type: Number, required: true },
  booked: { type: Number, default: 0 },
});

module.exports = mongoose.model("Class", ClassSchema);
