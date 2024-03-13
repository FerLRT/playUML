import { React, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";

import { getStudentQuizScore } from "../hooks/useQuiz";

import "../styles/quizButton.css";

export function QuizButton({ to, quizId, quizName }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    const loadStudentStats = async () => {
      try {
        const scoreObject = await getStudentQuizScore(user.id, quizId);
        setQuizScore(scoreObject.score);
      } catch (error) {
        console.error("Error loading student stats", error);
      }
    };

    loadStudentStats();
  }, [user, quizId]);

  const handleButtonClick = () => {
    navigate(`/quiz/${to}`);
  };

  // Determinar la imagen a mostrar según el puntaje
  let imageSrc = "/src/assets/clock.png";
  if (quizScore !== null) {
    imageSrc =
      quizScore >= 5 ? "/src/assets/check.png" : "/src/assets/uncheck.png";
  }

  const scoreClass =
    quizScore === null
      ? "quiz-button-number-na"
      : quizScore < 5
      ? "quiz-button-number-low"
      : "quiz-button-number-high";

  return (
    <button className="quiz-button" onClick={handleButtonClick}>
      <div className="quiz-button__content">
        <img
          src={imageSrc}
          alt="Clase"
          className="quiz-button__content-class"
        />
        <h2 className="quiz-button-name">{quizName}</h2>
      </div>
      <div className="quiz-button__content">
        <h1 className={`quiz-button-number ${scoreClass}`}>
          {quizScore === null ? "N/A" : `${quizScore}/10`}
        </h1>
        <h2>&rang;</h2>
      </div>
    </button>
  );
}
