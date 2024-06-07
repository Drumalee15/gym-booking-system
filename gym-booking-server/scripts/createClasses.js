const mongoose = require("mongoose");
const Class = require("../models/Class"); // Adjust the path according to your structure
const connectDB = require("../config/db"); // Ensure you have your DB connection setup
require('dotenv').config();

const createClasses = async () => {
  await connectDB();

  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-based in JavaScript
  const day = String(today.getDate()).padStart(2, '0');

  const classes = [
    {
      name: "Cardio Training",
      description: "High-intensity cardio workout.",
      image: "/assets/booking/cardio.jpg",
      schedule: new Date(`${year}-${month}-${day}T08:00:00Z`), // Specific date and time
      instructor: "John Doe",
      capacity: 20,
      booked: 0,
    },
    {
      name: "HIIT Training",
      description: "High-intensity interval training.",
      image: "/assets/booking/hiit.jpg",
      schedule: new Date(`${year}-${month}-${day}T10:00:00Z`), // Specific date and time
      instructor: "Jane Smith",
      capacity: 15,
      booked: 0,
    },
    {
      name: "Barre Burn",
      description: "A mix of Pilates, dance, yoga and functional training.",
      image: "/assets/booking/barre.jpg",
      schedule: new Date(`${year}-${month}-${day}T12:00:00Z`), // Specific date and time
      instructor: "Emily Davis",
      capacity: 10,
      booked: 0,
    },
    {
      name: "Strength & Core",
      description: "Build strength and core stability.",
      image: "/assets/booking/strength.jpg",
      schedule: new Date(`${year}-${month}-${day}T14:00:00Z`), // Specific date and time
      instructor: "Michael Johnson",
      capacity: 25,
      booked: 0,
    },
  ];

  try {
    // Delete existing class documents
    const result = await Class.deleteMany({});
    console.log(`${result.deletedCount} existing classes deleted.`);

    // Insert new class documents
    await Class.insertMany(classes);
    console.log("New classes created successfully.");
    mongoose.connection.close(); // Close the connection after operation
  } catch (error) {
    console.error("Error creating classes:", error);
    mongoose.connection.close(); // Ensure the connection is closed on error as well
  }
};

createClasses();
