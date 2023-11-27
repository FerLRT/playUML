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
}) {
  const [isChecked, setIsChecked] = useState(selected);

  const handleClick = () => {
    if (quizCompleted) return;

    const newCheckedState = !isChecked;
    setIsChecked(newCheckedState);
    onChange(id, newCheckedState);
  };

  return (
    <div
      className={`custom-radio ${isChecked ? "selected-radio" : ""}`}
      onClick={handleClick}
    >
      <div className="radio-circle">
        <span className="custom-radio-content">{letter}</span>
      </div>
      {questionType === 3 ? (
        <DiagramImage image={text} />
      ) : (
        <div className="custom-radio-text">{text}</div>
      )}
    </div>
  );
}

export default CustomRadioButton;
