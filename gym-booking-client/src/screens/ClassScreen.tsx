import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

interface Class {
  id: string;
  name: string;
  schedule: string;
  capacity: number;
  booked: number;
}

const ClassScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classDetails, setClassDetails] = useState<Class | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const res = await axios.get(`/api/classes/${id}`);
        setClassDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch class details:", err);
      }
    };

    fetchClassDetails();
  }, [id]);

  const bookClass = async () => {
    try {
      await axios.post("/api/bookings", { classId: id });
      navigate("/profile");
    } catch (err) {
      console.error("Failed to book class:", err);
    }
  };

  if (!classDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{classDetails.name}</h1>
      <p>Schedule: {new Date(classDetails.schedule).toLocaleString()}</p>
      <p>Capacity: {classDetails.capacity}</p>
      <p>Booked: {classDetails.booked}</p>
      <button onClick={bookClass}>Book This Class</button>
    </div>
  );
};

export default ClassScreen;
