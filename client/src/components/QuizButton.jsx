import { React } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/quizButton.css";

export function QuizButton({ to, label }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/quiz/${to}`);
  };

  return (
    <button className="quiz-button" onClick={handleButtonClick}>
      {label}
    </button>
  );
}
