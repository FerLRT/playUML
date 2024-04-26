import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { StatButton } from "../components/StatButton";
import { StudentQuizButtonReview } from "../components/StudentQuizButtonReview";

import { getStudentStats } from "../hooks/useUser";
import { getQuizzes } from "../hooks/useQuiz";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { MaterialSymbolsCheckBox } from "../assets/icons/Check";
import { FluentEmojiFlatSportsMedal } from "../assets/icons/Medal";
import { EmojioneTrophy } from "../assets/icons/Trophy";

import "../styles/studentStatsPage.css";

export function StudentStatsPage() {
  const { uid, token } = useAuth();
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentStats, setStudentStats] = useState({});

  const [error, setError] = useState("");

  const handleButtonClick = () => {
    navigate(`/class/${classId}`);
  };

  useEffect(() => {
    const fetchData = () => {
      Promise.all([getStudentStats(studentId, token), getQuizzes(uid, token)])
        .then(([studentStats, quizzes]) => {
          setStudentStats(studentStats.data);
          setQuizzes(quizzes.data);
        })
        .catch((error) => {
          setError("Error al cargar los datos del estudiante");
        });
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
      <Stack sx={{ width: "100%" }} spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
      <h1>Estadísticas de: {studentStats.studentEmail}</h1>
      <div className="student-stats-button-container">
        <StatButton
          imageComponent={<EmojioneTrophy />}
          stat="Ranking"
          value={studentStats.positionRanking}
          openModal={null}
        />

        <StatButton
          imageComponent={<FluentEmojiFlatSportsMedal />}
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
          imageComponent={<MaterialSymbolsCheckBox />}
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
