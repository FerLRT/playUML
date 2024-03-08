import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { StatButton } from "../components/StatButton";

import { getStudentStats } from "../hooks/useUser";

import "../styles/studentStatsPage.css";

export function StudentStatsPage() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [studentStats, setStudentStats] = useState({});

  const handleButtonClick = () => {
    navigate(`/class/${classId}`);
  };

  useEffect(() => {
    const loadStudentStats = async () => {
      try {
        const studentStats = await getStudentStats(studentId);
        setStudentStats(studentStats);
      } catch (error) {
        console.error("Error loading student stats", error);
      }
    };

    loadStudentStats();
  }, [studentId]);

  return (
    <div className="student-stats-page">
      <button className="back-button" onClick={handleButtonClick}>
        Volver
      </button>

      <div className="student-stats-button-container">
        <StatButton
          image_src="/src/assets/trofeo.png"
          stat="Ranking"
          value={studentStats.positionRanking}
          openModal={null}
        />

        <StatButton
          image_src="/src/assets/medalla.png"
          stat="Nota media"
          value={`${studentStats.averageScore}/10`}
          openModal={null}
        />

        <StatButton
          image_src="/src/assets/aceptar.png"
          stat="Completado"
          value={`${studentStats.completionPercentage}%`}
          openModal={null}
        />
      </div>
    </div>
  );
}
