import React from "react";
import { useParams, useNavigate } from "react-router-dom";

import "../styles/quizFooter.css";

export function QuizFooterReview({
  questions,
  currentQuestionIndex,
  goToQuestion,
  onNext,
  onPrev,
  studentId,
  userAnswers,
}) {
  const totalQuestions = questions.length;

  const { classId } = useParams();
  const navigate = useNavigate();

  const getCircleColor = (index) => {
    const score = questions[index].answers
      .filter((answer) => userAnswers[index].includes(answer.id))
      .reduce((acc, curr) => acc + curr.score, 0);

    if (score === 1) {
      return "#38d42a"; // green
    } else if (score >= 0 && score < 1) {
      return "#fdfd0f"; // yellow
    } else {
      return "#ec1b1b"; // red
    }
  };

  const handleButtonClick = () => {
    if (studentId) {
      navigate(`/class/${classId}/student/${studentId}`);
    } else {
      navigate(`/class/${classId}`);
    }
  };

  return (
    <div className="quiz-footer-container">
      <div className="quiz-footer-circles-buttons-container">
        <button
          className="quiz-footer-button-previous"
          onClick={() => {
            onPrev();
          }}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </button>

        {questions.map((_, index) => {
          const circleColor =
            index === currentQuestionIndex
              ? "#498bf9" // blue
              : "#ffffff"; // white
          return (
            <div
              key={index}
              onClick={() => {
                goToQuestion(index);
              }}
              className={`quiz-footer-circle ${""}`}
              style={{
                backgroundColor: studentId
                  ? getCircleColor(index)
                  : circleColor,
                border:
                  index === currentQuestionIndex && studentId
                    ? "3px solid #498bf9"
                    : "",
              }}
            >
              {index + 1}
            </div>
          );
        })}

        <button
          className="quiz-footer-button-next"
          onClick={() => {
            onNext();
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
          Volver
        </button>
      </div>
    </div>
  );
}
