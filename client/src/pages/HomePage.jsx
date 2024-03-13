import { useState, useEffect } from "react";
import { getQuizzes } from "../hooks/useQuiz";

import { LevelIndicator } from "../components/LevelIndicator.jsx";
import { QuizButton } from "../components/QuizButton.jsx";

import "../styles/homePage.css";

export function HomePage() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica para obtener la lista de tests
  useEffect(() => {
    getQuizzes().then((response) => {
      setQuizzes(response);
    });
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
      <h1>Home Page - Lista de tests</h1>
      <LevelIndicator />

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {Object.entries(quizzesByCategory).map(([category, categoryQuizzes]) => (
        <details key={category} open>
          <summary>
            <h2>{category}</h2>
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
      ))}
    </div>
  );
}
