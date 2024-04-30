import React from "react";
import { DiagramImage } from "./DiagramImage";
import { CustomRadioButton } from "./CustomRadioButton";

import { MingcuteFlag4Line } from "../assets/icons/UncheckFlag";
import { MingcuteFlag4Fill } from "../assets/icons/CheckedFlag";

import "../styles/questionType2.css";

export function QuestionType2({
  question,
  selectedAnswers,
  onAnswerSelect,
  onFlagToggle,
  flagged,
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

  const handleFlagToggle = () => {
    onFlagToggle(!flagged);
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
          <button
            className={`flag-button ${flagged ? "flagged" : ""}`}
            onClick={handleFlagToggle}
          >
            {flagged ? <MingcuteFlag4Fill /> : <MingcuteFlag4Line />}
          </button>
        </div>
        <div className="question-type-2-answers-container">
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
