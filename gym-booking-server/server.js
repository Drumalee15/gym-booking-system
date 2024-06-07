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

// Define Routes
app.use("/api/users", userRoutes);
app.use("/api/classes", (req, res) => res.json(mockClasses)); // Mock route for classes
app.use("/api/bookings", bookingRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
