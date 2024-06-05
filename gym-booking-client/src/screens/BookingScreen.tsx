import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./BookingScreen.css";

interface ClassDetail {
  _id: string;
  name: string;
  instructor: string;
  schedule: string;
  image: string;
  status: string;
}

const BookingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);

  const fetchClassDetails = async (date: Date) => {
    try {
      const res = await axios.get(`/api/classes/details`, {
        params: { date: date.toISOString().split("T")[0] },
      });
      setClassDetails(res.data);
    } catch (err) {
      console.error("Failed to fetch class details:", err);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchClassDetails(selectedDate!);
    }
  }, [selectedDate]);

  const handleBooking = async (classId: string) => {
    try {
      await axios.post(`/api/bookings`, { classId });
      alert("Class booked successfully!");
      fetchClassDetails(selectedDate!); // Refresh the class list after booking
    } catch (err) {
      console.error("Failed to book class:", err);
      alert("Failed to book class");
    }
  };

  return (
    <div className="booking-screen">
      <div className="header">
        <button className="back-button">&larr;</button>
        <h1>Class Details</h1>
      </div>
      <div className="date-picker">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="dd/MM/yyyy"
          inline
        />
      </div>
      <div className="class-list">
        {classDetails.map((cls) => (
          <div className="class-detail-card" key={cls._id}>
            <img src={cls.image} alt={cls.name} className="instructor-image" />
            <div className="class-info">
              <h3>{cls.name}</h3>
              <p>{cls.instructor}</p>
              <p>{cls.schedule}</p>
            </div>
            <button
              className={`status-button ${cls.status.toLowerCase()}`}
              onClick={() => handleBooking(cls._id)}
            >
              {cls.status === "Booked" ? "Booked" : "Book"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingScreen;
