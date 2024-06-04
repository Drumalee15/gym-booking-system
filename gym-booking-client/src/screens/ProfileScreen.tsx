import React, { useEffect, useState } from "react";
import axios from "axios";

interface Booking {
  id: string;
  className: string;
  classSchedule: string;
}

const ProfileScreen: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/bookings");
        setBookings(res.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1>Your Profile</h1>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking.id}>
            {booking.className} -{" "}
            {new Date(booking.classSchedule).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProfileScreen;
