import React from "react";
import "../styles/Footer.css";

function Footer({ questions, currentIndex, userAnswers, onCircleClick }) {
  // Función para determinar el estado de un círculo (verde, gris o blanco)
  const getCircleStatus = (index) => {
    const hasAnswer = userAnswers[index].length > 0;

    if (hasAnswer) {
      return "answered"; // Pregunta respondida
    } else if (index === currentIndex) {
      return "current"; // Pregunta actual
    } else {
      return "unanswered"; // Pregunta sin responder
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
