import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./HomeScreen.css";

interface Class {
  id: string;
  name: string;
  image: string;
  description: string;
}

const HomeScreen: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await axios.get("/api/classes");
        setClasses(res.data);
      } catch (err) {
        console.error("Failed to fetch classes:", err);
      }
    };

    fetchClasses();
  }, []);

  const handleClassClick = (id: string) => {
    navigate(`/booking/${id}`);
  };

  return (
    <div className="home-screen">
      <h1>Book a Class</h1>
      <div className="tabs">
        <button className="active">Classes</button>
        <button>Enrollments</button>
        <button>Appointments</button>
        <button>Events</button>
      </div>
      <div className="class-list">
        {classes.map((cls) => (
          <div
            className="class-card"
            key={cls.id}
            onClick={() => handleClassClick(cls.id)}
          >
            <img src={cls.image} alt={cls.name} />
            <h3>{cls.name}</h3>
            <p>{cls.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
