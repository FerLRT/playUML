import React, { useState, useEffect } from "react";
import { fetchQuizzes } from "../services/api";
import Header from "../components/Header";
import QuizButton from "../components/QuizButton";
import "../styles/QuizList.css";

function QuizList() {
  const [quizzes, setQuizzes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    // Lógica para obtener la lista de tests
    fetchQuizzes().then((response) => {
      setQuizzes(response.data);
    });
  }, []);

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="quizzes-page">
      <Header />
      <div className="quizzes">
        <h1>Lista de Tests Disponibles</h1>
        <input
          type="text"
          placeholder="Buscar por nombre del test"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredQuizzes.map((quiz) => (
          <QuizButton key={quiz.id} to={`/quiz/${quiz.id}`} label={quiz.name} />
        ))}
      </div>
    </div>
  );
}

export default QuizList;
