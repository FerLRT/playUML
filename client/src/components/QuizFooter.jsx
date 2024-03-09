import React from "react";
import "../styles/quizFooter.css";

export function QuizFooter({
  questions,
  currentQuestionIndex,
  goToQuestion,
  onNext,
  onPrev,
  onFinish,
  quizCompleted,
  setShowSummaryView,
  userAnswers,
  answersScore,
}) {
  const totalQuestions = questions.length;
  const finishButtonText = quizCompleted ? "Resumen" : "Finalizar";

  const calculateScoreColor = (score) => {
    if (score === 1) {
      return "#38d42a"; // green
    } else if (score >= 0 && score < 1) {
      return "#fdfd0f"; // yellow
    } else {
      return "#ec1b1b"; // red
    }
  };

  return (
    <div className="quiz-footer-container">
      <div className="quiz-footer-circles-buttons-container">
        <button
          className="quiz-footer-button-previous"
          onClick={() => {
            onPrev();
            setShowSummaryView(false);
          }}
          disabled={currentQuestionIndex === 0}
        >
          Anterior
        </button>

        {questions.map((_, index) => {
          const questionId = questions[index].id;
          const userAnswerIds = userAnswers[index];
          const scores = answersScore.filter(
            (score) =>
              score.questionId === questionId &&
              userAnswerIds.includes(score.answerId)
          );
          const totalScore = scores.reduce(
            (total, current) => total + current.score,
            0
          );
          const circleColor = quizCompleted
            ? calculateScoreColor(totalScore)
            : index === currentQuestionIndex
            ? "#498bf9" // blue
            : userAnswerIds.length > 0
            ? "#808080" // purple
            : "#ffffff"; // white
          return (
            <div
              key={index}
              onClick={() => {
                goToQuestion(index);
                setShowSummaryView(false);
              }}
              className={`quiz-footer-circle ${
                quizCompleted && currentQuestionIndex === index
                  ? "completed"
                  : ""
              }`}
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
        <button className="quiz-footer-button-finish" onClick={onFinish}>
          {finishButtonText}
        </button>
      </div>
    </div>
  );
}
