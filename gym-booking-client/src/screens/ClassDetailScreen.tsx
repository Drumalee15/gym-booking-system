import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ClassDetailScreen.css";

interface ClassDetail {
  id: string;
  name: string;
  description: string;
  image: string;
  schedule: string;
  instructor: string;
}

const ClassDetailScreen: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);

  useEffect(() => {
    const fetchClassDetail = async () => {
      try {
        const res = await axios.get(`/api/classes/${id}`);
        setClassDetail(res.data);
      } catch (err) {
        console.error("Failed to fetch class details:", err);
      }
    };

    fetchClassDetail();
  }, [id]);

  if (!classDetail) {
    return <div>Loading...</div>;
  }

  return (
    <div className="class-detail">
      <img src={classDetail.image} alt={classDetail.name} />
      <h1>{classDetail.name}</h1>
      <p>{classDetail.description}</p>
      <p>Instructor: {classDetail.instructor}</p>
      <p>Schedule: {classDetail.schedule}</p>
      <button className="book-button">Book Class</button>
    </div>
  );
};

export default ClassDetailScreen;
