import React, { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import "../styles/QuestionType2.css";

function QuestionType2({ question, onAnswerSelect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAnswer(event.target);
    onAnswerSelect(selectedValue);
  };

  return (
    <div className="question-type2-container">
      <div className="image-container">
        {/* Usar las cadenas base64 para mostrar las imágenes */}
        {question.images.map((image, index) => (
          <div key={index} className="individual-image-container">
            <div className="image-letter">
              {String.fromCharCode(65 + index)}
            </div>
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
            >
              <img
                src={`data:image/jpeg;base64,${image.image_data}`}
                alt={`Imagen ${index + 1}`}
              />
            </MapInteractionCSS>
          </div>
        ))}
      </div>
      <div className="text-container">
        <h2>{question.question_text}</h2>
        {/* Acceder a las respuestas con el id y mapearlas */}
        {question.answers.map((answer) => (
          <div key={answer.id}>
            <label>
              <input
                type="radio"
                name="option"
                value={answer.id}
                defaultChecked={selectedAnswer === answer.id}
                onChange={handleAnswerChange}
              />
              {answer.answer_text}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionType2;
