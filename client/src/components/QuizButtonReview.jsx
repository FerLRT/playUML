import { React } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/quizButtonReview.css";

export function QuizButtonReview({
  to,
  className,
  numResolveStudents,
  numStudents,
}) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${to}`);
  };

  return (
    <button className="quiz-button-review" onClick={handleButtonClick}>
      <div className="quiz-button-review__content">
        <img
          src="/src/assets/ojo.png"
          alt="Clase"
          className="quiz-button-review__content-class"
        />
        <h2 className="quiz-button-review-name">{className}</h2>
      </div>
      <div className="quiz-button-review__content">
        <h1 className="quiz-button-review-number">
          {numResolveStudents}/{numStudents}
        </h1>
        <h2>&rang;</h2>
      </div>
    </button>
  );
}
