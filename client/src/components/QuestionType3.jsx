import CustomRadioButton from "./CustomRadioButton";
import DiagramImage from "./DiagramImage";
import "../styles/QuestionType3.css";

function QuestionType3({
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
          <div key={answer.id} className="answer-container">
            <CustomRadioButton
              key={answer.id}
              id={answer.id}
              letter={letters[index]}
              text={`data:image/jpeg;base64,${answer.answer_image}`}
              selected={selectedAnswers.includes(answer.id)}
              onChange={handleAnswerChange}
              questionType={3}
              quizCompleted={quizCompleted}
            >
              <DiagramImage image={answer.answer_image} />
            </CustomRadioButton>
          </div>
        ))}
      </div>
    </div>
  );
}

export default QuestionType3;
