import { useState, useEffect } from "react";
import { getQuizzes } from "../hooks/useQuiz";

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
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="home-container">
      <h1>Home Page - Lista de tests</h1>

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredQuizzes.map((quiz) => (
        <QuizButton key={quiz.id} to={quiz.id} label={quiz.name} />
      ))}
    </div>
  );
}
