import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "react-toastify/dist/ReactToastify.css";
import { toast, ToastContainer } from "react-toastify";
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
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [classDetails, setClassDetails] = useState<ClassDetail[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassDetail | null>(null);

  const fetchClassDetails = useCallback(async (classId: string) => {
    try {
      console.log(`Fetching class details for ID: ${classId}`);
      const res = await axios.get(`/api/classes`);
      console.log("Class details fetched:", res.data);
      setClassDetails(res.data);
      const selectedClass = res.data.find(
        (cls: ClassDetail) => cls._id === classId
      );
      setSelectedClass(selectedClass || null);
    } catch (err) {
      console.error("Failed to fetch class details:", err);
    }
  }, []);

  const fetchClassBookings = useCallback(
    async (classId: string, date: Date) => {
      try {
        console.log(
          `Fetching bookings for class ID: ${classId} on date: ${date}`
        );
        const res = await axios.get(`/api/classes/${classId}/bookings`, {
          params: { date: date.toISOString().split("T")[0] },
        });
        console.log("Bookings fetched:", res.data);
        setClassDetails((prevDetails) =>
          prevDetails.map((cls) =>
            cls._id === classId ? { ...cls, bookings: res.data } : cls
          )
        );
      } catch (err) {
        console.error("Failed to fetch class bookings:", err);
      }
    },
    []
  );

  useEffect(() => {
    if (id) {
      console.log("Initial fetch for class details");
      fetchClassDetails(id);
    }
  }, [id, fetchClassDetails]);

  useEffect(() => {
    if (id && selectedDate) {
      console.log("Fetching class bookings effect triggered");
      fetchClassBookings(id, selectedDate);
    }
  }, [id, selectedDate, fetchClassBookings]);

  const handleBooking = async (classId: string) => {
    try {
      console.log(`Booking class with ID: ${classId}`);
      const res = await axios.post(`/api/classes/${classId}/book`);
      const updatedClass = res.data;
      setClassDetails((prevDetails) =>
        prevDetails.map((cls) => (cls._id === classId ? updatedClass : cls))
      );
      toast.success("Class booked successfully!");
      if (selectedDate) {
        fetchClassBookings(classId, selectedDate);
      }
    } catch (err) {
      console.error("Failed to book class:", err);
      toast.error("Failed to book class");
    }
  };

  const formatSchedule = (schedule: string) => {
    const date = new Date(schedule);
    return date.toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!selectedClass) {
    return <div>Loading...</div>;
  }

  return (
    <div className="booking-screen">
      <ToastContainer />
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
            <p>{formatSchedule(selectedClass.schedule)}</p>
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
