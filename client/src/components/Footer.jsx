import React from "react";
import "../styles/Footer.css";

function Footer({ questions, currentIndex }) {
  // Función para determinar el estado de un círculo (verde, gris o blanco)
  const getCircleStatus = (index) => {
    if (index < currentIndex) {
      return "answered"; // Pregunta respondida
    } else if (index === currentIndex) {
      return "current"; // Pregunta actual
    } else {
      return "unanswered"; // Pregunta sin responder
    }
  };

  return (
    <div className="footer">
      <div className="circles">
        {questions.map((question, index) => (
          <div key={index} className={`circle ${getCircleStatus(index)}`}></div>
        ))}
      </div>
    </div>
  );
}

export default Footer;
