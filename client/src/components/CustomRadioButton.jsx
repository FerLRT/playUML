import React from "react";
import { MapInteractionCSS } from "react-map-interaction";
import "../styles/CustomRadioButton.css";

function CustomRadioButton({
  id,
  letter,
  text,
  selected,
  onChange,
  questionType,
}) {
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
      {questionType === 3 ? (
        <MapInteractionCSS
          showControls
          defaultValue={{
            scale: 1,
            translation: { x: 0, y: 0 },
          }}
          minScale={0.5}
          maxScale={3}
          controlsClass="custom-controls"
        >
          <img src={text} alt={`Respuesta ${id}`} />
        </MapInteractionCSS>
      ) : (
        <div className="custom-radio-text">{text}</div>
      )}
    </div>
  );
}

export default CustomRadioButton;
