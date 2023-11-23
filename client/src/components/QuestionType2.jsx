import React, { useState } from "react";
import { MapInteractionCSS } from "react-map-interaction";
import CustomRadioButton from "./CustomRadioButton";
import "../styles/QuestionType2.css";

function QuestionType2({
  question,
  onAnswerSelect,
  onNextButtonClick,
  currentIndex,
  questions,
}) {
  const [selectedAnswers, setSelectedAnswers] = useState([]);

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const handleAnswerChange = (selectedValue) => {
    const updatedSelectedAnswers = [...selectedAnswers];

    if (updatedSelectedAnswers.includes(selectedValue)) {
      // Desmarcar la respuesta si ya estaba marcada
      updatedSelectedAnswers.splice(
        updatedSelectedAnswers.indexOf(selectedValue),
        1
      );
    } else {
      // Marcar la respuesta si no estaba marcada
      updatedSelectedAnswers.push(selectedValue);
    }

    setSelectedAnswers(updatedSelectedAnswers);
    onAnswerSelect(updatedSelectedAnswers);
  };

  return (
    <div className="question-type-container">
      <div className="image-container-type2">
        {/* Usar las cadenas base64 para mostrar las imágenes */}
        {question.images.map((image, index) => (
          <div key={index} className="individual-image-container">
            <div className="image-letter">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="individual-image">
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
                  src={`data:image/jpeg;base64,${image.image_data}`}
                  alt={`Imagen ${index + 1}`}
                />
              </MapInteractionCSS>
            </div>
          </div>
        ))}
      </div>
      <div className="text-container">
        <div className="question-header">
          <h2>{question.question_text}</h2>
          <button className="next-btn" onClick={onNextButtonClick}>
            {currentIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        </div>
        {/* Acceder a las respuestas con el id y mapearlas */}
        {question.answers.map((answer, index) => (
          <CustomRadioButton
            key={answer.id}
            id={answer.id}
            letter={letters[index]}
            text={answer.answer_text}
            selected={selectedAnswers.includes(answer.id)}
            onChange={handleAnswerChange}
            questionType={2}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionType2;
