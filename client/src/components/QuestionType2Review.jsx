import React from "react";
import { DiagramImage } from "./DiagramImage";
import { CustomRadioButtonReview } from "./CustomRadioButtonReview";

import "../styles/questionType2.css";

export function QuestionType2Review({
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
    <div className="question-type-2-container">
      <div className="question-type-2-diagram-image-container">
        {question.images.map((image, index) => (
          <div
            key={index}
            className="question-type-2-individual-image-container"
          >
            <div className="question-type-2-individual-image-container-letter">
              {String.fromCharCode(65 + index)}
            </div>
            <div className="individual-image">
              <DiagramImage image={image.image_data} />
            </div>
          </div>
        ))}
      </div>

      <div className="question-type-2-question-answers-container">
        <div className="question-type-question-flag">
          <h2 className="question-text">{question.question_text}</h2>
        </div>
        <div className="question-type-2-answers-container">
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
