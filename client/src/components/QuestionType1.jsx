import CustomRadioButton from "./CustomRadioButton";
import DiagramImage from "./DiagramImage";
import "../styles/QuestionType1.css";

function QuestionType1({
  question,
  letters,
  onAnswerSelect,
  onNextButtonClick,
  currentIndex,
  questions,
  selectedAnswers,
  quizCompleted,
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
      <DiagramImage image={question.images[0].image_data} />
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
            quizCompleted={quizCompleted}
          />
        ))}
      </div>
    </div>
  );
}

export default QuestionType1;
