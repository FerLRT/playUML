import React from "react";
import { DiagramImage } from "./DiagramImage";
import { CustomRadioButton } from "./CustomRadioButton";

import "../styles/questionType1.css";

export function QuestionType1({
  question,
  selectedAnswers,
  onAnswerSelect,
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
    <div className="question-type-1-container">
      <div className="question-type-1-diagram-image-container">
        <DiagramImage image={question.images[0].image_data} />
      </div>

      <div className="question-type-1-question-answers-container">
        <h2>{question.question_text}</h2>
        <div className="question-type-1-answers-container">
          {question.answers.map((answer, index) => {
            // Buscar el puntaje de esta respuesta específica
            const answerScore = answersScore.find(
              (score) => score.answerId === answer.id
            )?.score;

            return (
              <CustomRadioButton
                key={answer.id}
                index={index}
                answer={answer}
                selectionState={selectedAnswers.includes(answer.id)}
                onSelectionChange={handleAnswerChange}
                quizCompleted={quizCompleted}
                score={answerScore}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
