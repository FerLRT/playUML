import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/quizFooter.css";

export function QuizFooterReview({
  questions,
  currentQuestionIndex,
  goToQuestion,
  onNext,
  onPrev,
}) {
  const totalQuestions = questions.length;

  const { classId } = useParams();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${classId}`);
  };

  return (
    <div className="quiz-footer-container">
      <div className="quiz-footer-circles-buttons-container">
        <button
          className="quiz-footer-button-previous"
          onClick={() => {
            onPrev();
            // setShowSummaryView(false);
          }}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </button>

        {questions.map((_, index) => {
          const circleColor =
            index === currentQuestionIndex
              ? "#498bf9" // blue
              : "#808080"; // gray
          return (
            <div
              key={index}
              onClick={() => {
                goToQuestion(index);
                // setShowSummaryView(false);
              }}
              className={`quiz-footer-circle ${""}`}
              style={{ backgroundColor: circleColor }}
            >
              {index + 1}
            </div>
          );
        })}

        <button
          className="quiz-footer-button-next"
          onClick={() => {
            onNext();
            setShowSummaryView(false);
          }}
          disabled={currentQuestionIndex === totalQuestions - 1}
        >
          Siguiente
        </button>
      </div>

      <div className="quiz-footer-button-finish-container">
        <button
          className="quiz-footer-button-finish"
          onClick={handleButtonClick}
        >
          Volver a la clase
        </button>
      </div>
    </div>
  );
}
