import React, { useState } from "react";
import DiagramImage from "./DiagramImage";
import "../styles/CustomRadioButton.css";

function CustomRadioButton({
  id,
  letter,
  text,
  selected,
  onChange,
  questionType,
  quizCompleted,
  answersScore,
}) {
  const [isChecked, setIsChecked] = useState(selected);

  const handleClick = () => {
    if (quizCompleted) return;

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(id, newCheckedState);
  };

  const getCustomRadioClass = () => {
    if (quizCompleted) {
      if (isChecked) {
        const currentAnswerScore =
          answersScore.find((answer) => answer.answerId === id)?.score || 0;

        return currentAnswerScore <= 0
          ? "incorrect-selected"
          : "correct-selected";
      } else if (
        answersScore.some(
          (answer) => answer.answerId === id && answer.score > 0
        )
      ) {
        return "unselected-positive-score";
      } else {
        return "unanswered";
      }
    } else {
      // Mantén los estilos antiguos cuando el test no está completado
      return isChecked ? "selected-radio" : "";
    }
  };

  return (
    <div
      className={`custom-radio ${getCustomRadioClass()}`}
      onClick={handleClick}
    >
      <div className="radio-circle">
        <span className="custom-radio-content">{letter}</span>
      </div>
      <div className="image-container-3">
        {questionType === 3 ? (
          <DiagramImage image={text} />
        ) : (
          <div className="custom-radio-text">{text}</div>
        )}
      </div>
    </div>
  );
}

export default CustomRadioButton;
