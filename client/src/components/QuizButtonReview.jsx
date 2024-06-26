import { React } from "react";
import { useNavigate } from "react-router-dom";
import { MdiEyeCircle } from "../assets/icons/Eye";

import "../styles/quizButtonReview.css";

export function QuizButtonReview({
  to,
  classId,
  className,
  numResolveStudents,
  numStudents,
  averageScore,
}) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${classId}/quiz/${to}`);
  };

  return (
    <button className="quiz-button-review" onClick={handleButtonClick}>
      <div className="quiz-button-review__content">
        <MdiEyeCircle className="quiz-button-review-icon" />
        <h2 className="quiz-button-review-name">{className}</h2>
      </div>
      <div className="quiz-button-review__content">
        <h1 className="quiz-button-review-number">
          {numResolveStudents}/{numStudents}
        </h1>

        <h1 className="quiz-button-review-number">
          {isNaN(averageScore) || averageScore === null
            ? "--"
            : `${averageScore.toFixed(2)}/10`}
        </h1>

        <h1 className="quiz-button-review-number">
          {((numResolveStudents * 100) / numStudents).toFixed(0)}%
        </h1>

        <h2>&rang;</h2>
      </div>
    </button>
  );
}
