import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { StatButton } from "../components/StatButton";
import { StudentQuizButtonReview } from "../components/StudentQuizButtonReview";

import { getStudentStats } from "../hooks/useUser";
import { getQuizzes } from "../hooks/useQuiz";

import "../styles/studentStatsPage.css";

export function StudentStatsPage() {
  const { user } = useAuth();
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentStats, setStudentStats] = useState({});

  const handleButtonClick = () => {
    navigate(`/class/${classId}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentStats, quizzes] = await Promise.all([
          getStudentStats(studentId),
          getQuizzes(user.id),
        ]);
        setStudentStats(studentStats);
        setQuizzes(quizzes);
      } catch (error) {
        console.error("Error loading data", error);
      }
    };

    fetchData();
  }, [studentId]);

  // Lógica para filtrar la lista de tests
  const quizzesByCategory = quizzes.reduce((acc, quiz) => {
    const { category } = quiz;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(quiz);
    return acc;
  }, {});

  return (
    <div className="student-stats-page">
      <h1>Estadísticas de: {studentStats.studentEmail}</h1>
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

      {Object.entries(quizzesByCategory).map(([category, categoryQuizzes]) => (
        <details className="category-quizzes-group" key={category} open>
          <summary>
            <h2>
              {category} (
              {studentStats.averageScoresByCategory[category] || "--"}/10)
            </h2>
          </summary>
          <div className="category-quizzes">
            {categoryQuizzes
              .filter((quiz) =>
                quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((quiz) => (
                <StudentQuizButtonReview
                  key={quiz.id}
                  to={quiz.id}
                  quizId={quiz.id}
                  quizName={quiz.name}
                />
              ))}
          </div>
        </details>
      ))}

      <div className="student-stats-back-button-container">
        <button className="button-basic" onClick={handleButtonClick}>
          Volver
        </button>
      </div>
    </div>
  );
}
