import { MapInteractionCSS } from "react-map-interaction";
import CustomRadioButton from "./CustomRadioButton";
import "../styles/QuestionType1.css";

function QuestionType1({
  question,
  onAnswerSelect,
  onNextButtonClick,
  currentIndex,
  questions,
  selectedAnswers,
}) {
  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  const handleAnswerChange = (selectedValue) => {
    const updatedSelectedAnswers = Array.isArray(selectedAnswers)
      ? [...selectedAnswers]
      : [];

    if (updatedSelectedAnswers.includes(selectedValue)) {
      updatedSelectedAnswers.splice(
        updatedSelectedAnswers.indexOf(selectedValue),
        1
      );
    } else {
      updatedSelectedAnswers.push(selectedValue);
    }

    onAnswerSelect(updatedSelectedAnswers);
  };

  return (
    <div className="question-type-container">
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
        <div className="question-header">
          <h2>{question.question_text}</h2>
          <button className="next-btn" onClick={onNextButtonClick}>
            {currentIndex < questions.length - 1 ? "Siguiente" : "Finalizar"}
          </button>
        </div>
        {question.answers.map((answer, index) => (
          <CustomRadioButton
            key={answer.id}
            id={answer.id}
            letter={letters[index]}
            text={answer.answer_text}
            selected={selectedAnswers.includes(answer.id)}
            onChange={handleAnswerChange}
            questionType={1}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionType1;
