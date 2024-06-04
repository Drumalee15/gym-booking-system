import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "./BookingScreen.css";

interface BookingClass {
  id: string;
  name: string;
  instructor: string;
  schedule: string;
}

const BookingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classDetails, setClassDetails] = useState<BookingClass[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassDetails = async () => {
      if (id) {
        try {
          const res = await axios.get(`/api/classes/${id}/bookings`);
          setClassDetails(res.data);
        } catch (err) {
          console.error("Failed to fetch class details:", err);
        }
      }
    };

    fetchClassDetails();
  }, [id]);

  const handleBookingClick = (bookingId: string) => {
    navigate(`/class/${bookingId}`);
  };

  return (
    <div className="booking-screen">
      <h1>Class Bookings</h1>
      <div className="booking-list">
        {classDetails.map((cls) => (
          <div
            className="booking-card"
            key={cls.id}
            onClick={() => handleBookingClick(cls.id)}
          >
            <h3>{cls.name}</h3>
            <p>{cls.instructor}</p>
            <p>{cls.schedule}</p>
            <button className="book-button">Book</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingScreen;
