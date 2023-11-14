import React from "react";
import "../styles/CustomRadioButton.css";

function CustomRadioButton({ id, letter, text, selected, onChange }) {
  const handleClick = () => {
    onChange(id);
  };

  return (
    <div
      className={`custom-radio ${selected ? "selected-radio" : ""}`}
      onClick={handleClick}
    >
      <div className="radio-circle">
        <span className="custom-radio-content">{letter}</span>
      </div>
      {text}
    </div>
  );
}

export default CustomRadioButton;
