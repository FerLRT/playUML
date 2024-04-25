import { React, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getStudentQuizScore } from "../hooks/useQuiz";

import { MdiEyeCircle } from "../assets/icons/Eye";

import { useAuth } from "../context/AuthContext";

import "../styles/quizButtonReview.css";

export function StudentQuizButtonReview({ to, quizId, quizName }) {
  const { token } = useAuth();
  const { classId, studentId } = useParams();
  const navigate = useNavigate();

  const [quizScore, setQuizScore] = useState(null);

  useEffect(() => {
    const loadStudentStats = async () => {
      try {
        const scoreObject = await getStudentQuizScore(studentId, quizId, token);
        setQuizScore(scoreObject.score);
      } catch (error) {
        console.error("Error loading student stats", error);
      }
    };

    loadStudentStats();
  }, [studentId, quizId]);

  const handleButtonClick = () => {
    navigate(`/class/${classId}/student/${studentId}/quiz/${to}`);
  };

  const scoreClass =
    quizScore === null
      ? "quiz-button-review-number-na"
      : quizScore < 5
      ? "quiz-button-review-number-low"
      : "quiz-button-review-number-high";

  return (
    <button className="quiz-button-review" onClick={handleButtonClick}>
      <div className="quiz-button-review__content">
        <MdiEyeCircle className="quiz-button-review-icon" />
        <h2 className="quiz-button-review-name">{quizName}</h2>
      </div>
      <div className="quiz-button-review__content">
        <h1 className={`quiz-button-review-number ${scoreClass}`}>
          {quizScore === null ? "N/A" : `${quizScore}/10`}
        </h1>
        <h2>&rang;</h2>
      </div>
    </button>
  );
}
