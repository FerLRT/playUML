import React, { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import CustomRadioButton from "./CustomRadioButton";
import "../styles/QuestionType1.css";

function QuestionType1({ question, onAnswerSelect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const letters = ["A", "B", "C", "D"];

  const handleAnswerChange = (selectedValue) => {
    setSelectedAnswer(selectedValue);
    onAnswerSelect(selectedValue);
  };

  return (
    <div className="question-type1-container">
      <div className="image-container">
        {/* Usar la cadena base64 para mostrar la imagen */}
        {/* MapInteractionCSS permite interactuar con la imagen */}
        <MapInteractionCSS
          showControls
          defaultValue={{
            scale: 1,
            translation: { x: 0, y: 0 },
          }}
          minScale={0.5}
          maxScale={3}
          translationBounds={{
            xMax: 400,
            yMax: 200,
          }}
          controlsClass="custom-controls"
        >
          <img
            src={`data:image/jpeg;base64,${question.images[0].image_data}`}
            alt="Diagrama de la pregunta"
          />
        </MapInteractionCSS>
      </div>
      <div className="text-container">
        <h2>{question.question_text}</h2>
        {question.answers.map((answer, index) => (
          <CustomRadioButton
            key={answer.id}
            id={answer.id}
            letter={letters[index]}
            text={answer.answer_text}
            selected={selectedAnswer === answer.id}
            onChange={handleAnswerChange}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionType1;
