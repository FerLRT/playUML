import React from "react";
import "../styles/Footer.css";

function Footer({
  questions,
  currentIndex,
  userAnswers,
  onCircleClick,
  quizCompleted,
  answersScore,
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

      if (totalScore === 1) {
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
      </div>
    </div>
  );
}

export default Footer;
