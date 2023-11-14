import React, { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import "../styles/QuestionType3.css";

function QuestionType3({ question, onAnswerSelect }) {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedAnswer(event.target);
    onAnswerSelect(selectedValue);
  };

  return (
    <div className="question-type3-container">
      <div className="image-container">
        {/* Usar la cadena base64 para mostrar la imagen */}
        {question.images.map((image, index) => (
          <div key={index} className="individual-image-container">
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
                alt={`Imagen de la pregunta ${index + 1}`}
              />
            </MapInteractionCSS>
          </div>
        ))}
      </div>
      <div className="text-container">
        <h2>{question.question_text}</h2>
        {/* Acceder a las respuestas con el id y mapearlas */}
        {question.answers.map((answer, index) => (
          <div key={answer.id} className="answer-container">
            <label>
              <input
                type="radio"
                name="option"
                value={answer.id}
                defaultChecked={selectedAnswer === answer.id}
                onChange={handleAnswerChange}
              />

              {/* Usar la cadena base64 para mostrar la respuesta */}
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
                  src={`data:image/jpeg;base64,${answer.answer_image}`}
                  alt={`Respuesta ${index + 1}`}
                />
              </MapInteractionCSS>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionType3;
