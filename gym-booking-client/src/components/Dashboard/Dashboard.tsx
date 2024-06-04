import React, { useState, useEffect } from "react";
import axios from "axios";

interface IClass {
  _id: string;
  name: string;
  schedule: string;
  capacity: number;
  booked: number;
}

interface IBooking {
  _id: string;
  class: IClass;
  bookingDate: string;
}

const Dashboard: React.FC = () => {
  const [classes, setClasses] = useState<IClass[]>([]);
  const [bookings, setBookings] = useState<IBooking[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes");
        setClasses(res.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response.data);
        } else {
          console.error(err);
        }
      }
    };

    const fetchBookings = async () => {
      try {
        const res = await axios.get("/api/bookings");
        setBookings(res.data);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          console.error(err.response.data);
        } else {
          console.error(err);
        }
      }
    };

    fetchClasses();
    fetchBookings();
  }, []);

  const bookClass = async (classId: string) => {
    try {
      const res = await axios.post("/api/bookings", { classId });
      setBookings([...bookings, res.data]);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        console.error(err.response.data);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <h2>Available Classes</h2>
      <ul>
        {classes.map((cls) => (
          <li key={cls._id}>
            {cls.name} - {new Date(cls.schedule).toLocaleString()} -{" "}
            {cls.capacity - cls.booked} spots left
            <button onClick={() => bookClass(cls._id)}>Book</button>
          </li>
        ))}
      </ul>
      <h2>Your Bookings</h2>
      <ul>
        {bookings.map((booking) => (
          <li key={booking._id}>
            {booking.class.name} -{" "}
            {new Date(booking.class.schedule).toLocaleString()} - Booked on{" "}
            {new Date(booking.bookingDate).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Dashboard;
