import React from "react";
import { Link } from "react-router-dom";
import "../styles/QuizButton.css";

function QuizButton({ to, label }) {
  return (
    <Link to={to} style={{ textDecoration: "none" }}>
      <button className="custom-quiz-button">{label}</button>
    </Link>
  );
}

export default QuizButton;
