import React, { useState } from "react";
import { DiagramImage } from "./DiagramImage";
import { CodeViewer } from "./CodeViewer";

import "../styles/customRadioButton.css";

export function CustomRadioButton({
  index,
  answer,
  onSelectionChange,
  selectionState,
  quizCompleted,
  score,
}) {
  const [isSelected, setIsSelected] = useState(selectionState);

  const toggleSelection = () => {
    if (quizCompleted) return;

    setIsSelected(!isSelected);
    onSelectionChange(answer.id, !isSelected);
  };

  // Determinar el color del radio button según el score
  const getRadioButtonColor = () => {
    if (quizCompleted) {
      if (isSelected) {
        // Si el usuario ha seleccionado la respuesta
        if (score > 0) {
          // Si el score es positivo, colorear de verde
          return "green";
        } else if (score <= 0) {
          // Si el score es cero o negativo, colorear de rojo
          return "red";
        }
      }

      if (!isSelected) {
        // Si el usuario ha seleccionado la respuesta
        if (score > 0) {
          // Si el score es positivo, colorear de verde
          return "blue";
        } else if (score <= 0) {
          // Si el score es cero o negativo, colorear de rojo
          return "";
        }
      }
    }
  };

  return (
    <div
      className={`custom-radio-button-container ${
        isSelected ? "selected" : ""
      }`}
    >
      <button
        className={`custom-radio-button ${
          isSelected ? "selected" : ""
        } ${getRadioButtonColor()}`}
        onClick={toggleSelection}
      >
        <div
          className={`custom-radio-button-letter ${
            isSelected ? "selected" : ""
          } ${getRadioButtonColor()}`}
        >
          {String.fromCharCode(65 + index)}
        </div>

        <div className="custom-radio-button-answer">
          {answer.answer_text !== null ? (
            <div className="custom-radio-button-answer-text">
              {answer.answer_text}
            </div>
          ) : answer.answer_image !== null ? (
            <div className="custom-radio-button-answer-image">
              <DiagramImage image={answer.answer_image} />
            </div>
          ) : (
            <div className="custom-radio-button-answer-code">
              <CodeViewer code={answer.answer_code} />
            </div>
          )}
        </div>
      </button>
    </div>
  );
}
