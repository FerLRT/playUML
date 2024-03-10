import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { StatButton } from "../components/StatButton";
import { StudentQuizButtonReview } from "../components/StudentQuizButtonReview";

import { getStudentStats } from "../hooks/useUser";
import { getQuizzes } from "../hooks/useQuiz";

import "../styles/studentStatsPage.css";

export function StudentStatsPage() {
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

    const loadQuizzes = async () => {
      try {
        const quizzes = await getQuizzes();
        setQuizzes(quizzes);
      } catch (error) {
        console.error("Error loading quizzes", error);
      }
    };

    loadStudentStats();
    loadQuizzes();
  }, [studentId]);

  // Lógica para filtrar la lista de tests
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="student-stats-page">
      <h1>Estadísticas del estudiante: {studentStats.studentEmail}</h1>

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
          value={
            isNaN(studentStats.averageScore) ||
            studentStats.averageScore === null
              ? "--"
              : `${studentStats.averageScore}/10`
          }
          openModal={null}
        />

        <StatButton
          image_src="/src/assets/aceptar.png"
          stat="Completado"
          value={`${studentStats.completionPercentage}%`}
          openModal={null}
        />
      </div>

      <h1>Tests</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="class-page-search-bar"
      />

      {filteredQuizzes.map((quiz) => (
        <StudentQuizButtonReview
          key={quiz.id}
          to={quiz.id}
          quizId={quiz.id}
          quizName={quiz.name}
        />
      ))}
    </div>
  );
}
