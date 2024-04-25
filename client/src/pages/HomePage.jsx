import { useState, useEffect } from "react";

import { getStudentStats } from "../hooks/useUser";
import { getQuizzes } from "../hooks/useQuiz";

import { LevelIndicator } from "../components/LevelIndicator.jsx";
import { QuizButton } from "../components/QuizButton.jsx";
import { Ranking } from "../components/Ranking.jsx";
import { StatButton } from "../components/StatButton.jsx";

import { useAuth } from "../context/AuthContext";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { EmojioneTrophy } from "../assets/icons/Trophy";
import { FluentEmojiFlatSportsMedal } from "../assets/icons/Medal";
import { MaterialSymbolsCheckBox } from "../assets/icons/Check";

import "../styles/homePage.css";

export function HomePage() {
  const { uid, uRole, email, token, user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentStats, setStudentStats] = useState({});

  const [error, setError] = useState("");

  // Lógica para obtener la lista de tests
  useEffect(() => {
    const fetchData = () => {
      Promise.all([getStudentStats(uid, token), getQuizzes(uid, token)])
        .then(([studentStats, quizzes]) => {
          setStudentStats(studentStats.data);
          setQuizzes(quizzes.data);
        })
        .catch((error) => {
          setError(
            "Algo salió mal al cargar la página. Por favor, intentalo de nuevo."
          );
        });
    };

    fetchData();
  }, []);

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
    <div className="home-container">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <LevelIndicator />

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

      {user && (
        <Ranking
          classId={user.current_class_id}
          userId={email}
          userRole={uRole}
        />
      )}

      <h1 className="home-test-list-title">Tests disponibles</h1>
      <div className="home-test-list-container">
        <input
          type="text"
          placeholder="Buscar..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {Object.entries(quizzesByCategory).map(
          ([category, categoryQuizzes]) => (
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
                    <QuizButton
                      key={quiz.id}
                      to={quiz.id}
                      quizId={quiz.id}
                      quizName={quiz.name}
                    />
                  ))}
              </div>
            </details>
          )
        )}
      </div>
    </div>
  );
}
