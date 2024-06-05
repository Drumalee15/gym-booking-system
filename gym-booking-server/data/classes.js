// Import images
const cardioImage = require("../assets/booking/cardio.jpg");
const hiitImage = require("../assets/booking/hiit.jpg");
const barreImage = require("../assets/booking/barre.jpg");
const strengthImage = require("../assets/booking/strength.jpg");

// Define the classes array
const classes = [
  {
    id: "1",
    name: "Cardio Training",
    image: cardioImage,
    schedule: new Date("2024-05-28T08:00:00Z"),
    instructor: "John Doe",
    capacity: 20,
    booked: 0,
  },
  {
    id: "2",
    name: "HIIT Training",
    image: hiitImage,
    schedule: new Date("2024-05-28T10:00:00Z"),
    instructor: "Jane Smith",
    capacity: 15,
    booked: 0,
  },
  {
    id: "3",
    name: "Barre Burn",
    image: barreImage,
    schedule: new Date("2024-05-29T09:00:00Z"),
    instructor: "Emily Davis",
    capacity: 10,
    booked: 0,
  },
  {
    id: "4",
    name: "Strength & Core",
    image: strengthImage,
    schedule: new Date("2024-05-29T11:00:00Z"),
    instructor: "Michael Johnson",
    capacity: 25,
    booked: 0,
  },
];

module.exports = classes;
