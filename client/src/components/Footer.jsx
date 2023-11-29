import React from "react";
import "../styles/Footer.css";

function Footer({
  questions,
  currentIndex,
  userAnswers,
  onCircleClick,
  quizCompleted,
  answersScore,
  showSummary,
  onSummaryButtonClick,
}) {
  // Función para determinar el estado de un círculo
  const getCircleStatus = (index) => {
    const selectedAnswers = userAnswers[index];

    if (quizCompleted) {
      if (selectedAnswers.length === 0) {
        return "unanswered"; // Pregunta no respondida
      }

      const totalScore = selectedAnswers.reduce((acc, answerId) => {
        const answer = answersScore.find((a) => a.answerId === answerId);
        return acc + (answer ? answer.score : 0);
      }, 0);

      const maxScore = getMaxScoreForQuestion(index);

      if (totalScore === maxScore) {
        return "all-answered-correct"; // Todas las respuestas seleccionadas son correctas
      } else if (totalScore < 0) {
        return "all-answered-incorrect"; // Ninguna respuesta correcta ha sido marcada
      } else {
        return "some-answered"; // Al menos una respuesta correcta o incorrecta ha sido marcada
      }
    } else {
      const hasAnswer = selectedAnswers.length > 0;

      if (hasAnswer) {
        return "answered"; // Pregunta respondida
      } else if (index === currentIndex) {
        return "current"; // Pregunta actual
      } else {
        return "unanswered"; // Pregunta sin responder
      }
    }
  };

  const getMaxScoreForQuestion = (questionIndex) => {
    // Filtramos las respuestas que pertenecen a la pregunta específica
    const answersForQuestion = answersScore.filter(
      (answer) => answer.questionId === questionIndex + 1
    );

    // Sumamos los puntajes máximos de todas las respuestas
    const maxScoreForQuestion = answersForQuestion.reduce(
      (maxScore, answer) => maxScore + Math.max(answer.score, 0),
      0
    );

    return maxScoreForQuestion;
  };

  const handleArrowClick = (direction) => {
    if (direction === "prev" && currentIndex > 0) {
      onCircleClick(currentIndex - 1);
    } else if (direction === "next" && currentIndex < questions.length - 1) {
      onCircleClick(currentIndex + 1);
    }
  };

  return (
    <div className="footer">
      <div className="arrows">
        <div className="arrow" onClick={() => handleArrowClick("prev")}>
          {"<--"}
        </div>
      </div>
      <div className="circles">
        {questions.map((question, index) => (
          <div
            key={index}
            className={`circle ${getCircleStatus(index)}`}
            onClick={() => onCircleClick(index)}
          ></div>
        ))}
      </div>
      <div className="arrows">
        <div className="arrow" onClick={() => handleArrowClick("next")}>
          {"-->"}
        </div>
        {quizCompleted && (
          // Botón para volver al resumen cuando el test está completo
          <button
            className="summary-button"
            onClick={onSummaryButtonClick}
            disabled={showSummary}
          >
            Ver resumen
          </button>
        )}
      </div>
    </div>
  );
}

export default Footer;
