import React, { useState, useEffect } from "react";
import { DiagramImage } from "./DiagramImage";
import { CodeViewer } from "./CodeViewer";

import "../styles/customRadioButton.css";

export function CustomRadioButtonReview({
  index,
  answer,
  onSelectionChange,
  selectionState,
  studentId,
}) {
  const [isSelected, setIsSelected] = useState(selectionState);

  useEffect(() => {
    setIsSelected(selectionState);
  }, [selectionState]);

  const toggleSelection = () => {
    if (studentId === undefined || studentId === null) {
      setIsSelected(!isSelected);
      onSelectionChange(answer.id, !isSelected);
    }
  };

  // Determinar el color del radio button según el score
  const getRadioButtonColor = () => {
    const score = answer.score;

    if (isSelected) {
      if (score > 0) {
        return "green";
      } else if (score < 0) {
        return "red";
      } else {
        return "yellow";
      }
    } else {
      return "";
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
