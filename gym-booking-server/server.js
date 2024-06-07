const express = require("express");
const path = require("path");
const cors = require("cors");
const connectDB = require("./config/db");
const userRoutes = require("./routes/user");
const bookingRoutes = require("./routes/bookings");
const mockClasses = require("./data/mockData.json"); // Adjust the path if necessary
require("dotenv").config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

// Enable CORS
app.use(cors());

// Serve static files from the "public" directory
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// Mock routes for classes
app.get("/api/classes", (req, res) => {
  res.json(mockClasses);
});

app.post("/api/classes/:id/book", (req, res) => {
  const classId = req.params.id;
  const bookedClass = mockClasses.find((cls) => cls._id === classId);

  if (bookedClass) {
    if (bookedClass.status === "Booked") {
      return res.status(400).json({ message: "Class already booked" });
    }

    bookedClass.status = "Booked";
    res.json(bookedClass);
  } else {
    res.status(404).json({ message: "Class not found" });
  }
});

app.post("/api/classes/:id/cancel", (req, res) => {
  const classId = req.params.id;
  const bookedClass = mockClasses.find((cls) => cls._id === classId);

  if (bookedClass) {
    if (bookedClass.status !== "Booked") {
      return res.status(400).json({ message: "Class is not booked" });
    }

    bookedClass.status = "Available";
    res.json(bookedClass);
  } else {
    res.status(404).json({ message: "Class not found" });
  }
});

// Define Routes
app.use("/api/users", userRoutes);
// app.use("/api/classes", (req, res) => res.json(mockClasses)); // Mock route for classes
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
