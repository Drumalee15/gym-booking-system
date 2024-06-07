import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
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
  booked?: number;
  capacity?: number;
}

const BookingScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetail | null>(null);

  const fetchClassDetails = async (classId: string) => {
    try {
      console.log(`Fetching class details for ID: ${classId}`);
      const res = await axios.get(`/api/classes`);
      console.log("Class details fetched:", res.data); // Debugging line
      setClassDetails(res.data);
      const selectedClass = res.data.find(
        (cls: ClassDetail) => cls._id === classId
      );
      setSelectedClass(selectedClass || null);
    } catch (err) {
      console.error("Failed to fetch class details:", err);
    }
  };

  const fetchClassBookings = useCallback(
    async (classId: string, date: Date) => {
      try {
        const res = await axios.get(`/api/classes/${classId}/bookings`, {
          params: { date: date.toISOString().split("T")[0] },
        });
        setClassDetails((prevDetails) =>
          prevDetails.map((cls) =>
            cls._id === classId ? { ...cls, bookings: res.data } : cls
          )
        );
        const updatedClass = classDetails.find((cls) => cls._id === classId);
        setSelectedClass(updatedClass || null);
      } catch (err) {
        console.error("Failed to fetch class bookings:", err);
      }
    },
    [classDetails]
  );

  useEffect(() => {
    if (id) {
      fetchClassDetails(id);
    }
  }, [id]);

  useEffect(() => {
    if (id && selectedDate) {
      fetchClassBookings(id, selectedDate);
    }
  }, [id, selectedDate, fetchClassBookings]);

  const handleBooking = async (classId: string) => {
    try {
      const res = await axios.post(`/api/classes/${classId}/book`);
      const updatedClass = res.data;
      setClassDetails((prevDetails) =>
        prevDetails.map((cls) =>
          cls._id === classId ? { ...cls, ...updatedClass } : cls
        )
      );
      setSelectedClass((prevDetails) =>
        prevDetails ? { ...prevDetails, ...updatedClass } : null
      );
      alert("Class booked successfully!");
      if (selectedDate) {
        fetchClassBookings(classId, selectedDate); // Refresh the class list after booking
      }
    } catch (err) {
      console.error("Failed to book class:", err);
      alert("Failed to book class");
    }
  };

  if (!selectedClass) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-screen">
      <div className="header">
        <button className="back-button" onClick={() => navigate(-1)}>
          &larr;
        </button>
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
        <div className="class-detail-card" key={selectedClass._id}>
          <img
            src={selectedClass.image}
            alt={selectedClass.name}
            className="instructor-image"
          />
          <div className="class-info">
            <h3>{selectedClass.name}</h3>
            <p>{selectedClass.instructor}</p>
            <p>{selectedClass.schedule}</p>
          </div>
          <button
            className={`status-button ${selectedClass.status.toLowerCase()}`}
            onClick={() => handleBooking(selectedClass._id)}
            disabled={selectedClass.status === "Booked"}
          >
            {selectedClass.status === "Booked" ? "Booked" : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingScreen;
