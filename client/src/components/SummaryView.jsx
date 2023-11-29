import React from "react";
import "../styles/SummaryView.css";

function SummaryView({ questions, userAnswers, answersScore, totalScore }) {
  // Función para calcular la puntuación total
  return (
    <div className="summary-view">
      <h2>Resumen del Test</h2>
      <div className="score">Puntuación total: {totalScore}</div>
      {/* Se añadirá toda la información necesaria aquí */}
    </div>
  );
}

export default SummaryView;
