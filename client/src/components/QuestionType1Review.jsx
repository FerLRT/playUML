import React, { useEffect } from "react";
import { DiagramImage } from "./DiagramImage";
import { CustomRadioButtonReview } from "./CustomRadioButtonReview";

import "../styles/questionType1.css";

export function QuestionType1Review({
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
    <div className="question-type-1-container">
      <div className="question-type-1-diagram-image-container">
        <DiagramImage image={question.images[0].image_data} />
      </div>

      <div className="question-type-1-question-answers-container">
        <h2>{question.question_text}</h2>
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
