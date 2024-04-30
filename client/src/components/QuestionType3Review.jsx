import React from "react";
import { DiagramImage } from "./DiagramImage";
import { CustomRadioButtonReview } from "./CustomRadioButtonReview";

import "../styles/questionType3.css";

export function QuestionType3Review({
  question,
  selectedAnswers,
  onAnswerSelect,
  studentId,
}) {
  const handleAnswerChange = (selectedValue) => {
    if (studentId === undefined || studentId === null) {
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
    }
  };

  return (
    <div className="question-type-3-container">
      <div className="question-type-3-diagram-image-container">
        <DiagramImage image={question.images[0].image_data} />
      </div>

      <div className="question-type-1-question-answers-container">
        <div className="question-type-question-flag">
          <h2 className="question-text">{question.question_text}</h2>
        </div>
        <div className="question-type-1-answers-container">
          {question.answers.map((answer, index) => {
            return (
              <CustomRadioButtonReview
                key={answer.id}
                index={index}
                answer={answer}
                selectionState={selectedAnswers.includes(answer.id)}
                onSelectionChange={handleAnswerChange}
                studentId={studentId}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
