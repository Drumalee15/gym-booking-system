import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ClassDetailScreen.css";

import cardioImage from "../assets/booking/cardio.jpg";
import hiitImage from "../assets/booking/hiit.jpg";
import barreImage from "../assets/booking/barre.jpg";
import strengthImage from "../assets/booking/strength.jpg";

const imageMap: { [key: string]: string } = {
  "cardio.jpg": cardioImage,
  "hiit.jpg": hiitImage,
  "barre.jpg": barreImage,
  "strength.jpg": strengthImage,
};

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
        const res = await axios.get<ClassDetail>(`/api/classes/${id}`);
        const data = res.data;

        console.log("API response data:", data);

        if (imageMap.hasOwnProperty(data.image)) {
          data.image = imageMap[data.image];
        }

        console.log("Mapped data:", data);

        setClassDetail(data);
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
