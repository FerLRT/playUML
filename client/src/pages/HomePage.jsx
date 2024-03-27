import { useState, useEffect } from "react";

import { getStudentStats } from "../hooks/useUser";
import { getQuizzes } from "../hooks/useQuiz";

import { LevelIndicator } from "../components/LevelIndicator.jsx";
import { QuizButton } from "../components/QuizButton.jsx";
import { Ranking } from "../components/Ranking.jsx";

import { useAuth } from "../context/AuthContext";

import "../styles/homePage.css";

export function HomePage() {
  const { user } = useAuth();

  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentStats, setStudentStats] = useState({});

  // Lógica para obtener la lista de tests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentStats, quizzes] = await Promise.all([
          getStudentStats(user.id),
          getQuizzes(user.id),
        ]);
        setStudentStats(studentStats);
        setQuizzes(quizzes);
      } catch (error) {
        console.error("Error loading data", error);
      }
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
      <LevelIndicator />

      <Ranking
        classId={user.current_class_id}
        userId={user.email}
        userRole={user.role}
      />

      <h1>Tests disponibles</h1>
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
