import CustomRadioButton from "./CustomRadioButton";
import DiagramImage from "./DiagramImage";
import "../styles/QuestionType2.css";

function QuestionType2({
  question,
  letters,
  onAnswerSelect,
  onNextButtonClick,
  currentIndex,
  questions,
  selectedAnswers,
  quizCompleted,
  answersScore,
}) {
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
      <div className="image-container-type2">
        {/* Usar las cadenas base64 para mostrar las imágenes */}
        {question.images.map((image, index) => (
          <div key={index} className="individual-image-container">
            <div className="image-letter">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="individual-image">
              <DiagramImage image={image.image_data} />
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
            quizCompleted={quizCompleted}
            answersScore={answersScore}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionType2;
