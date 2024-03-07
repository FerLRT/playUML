import { React } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/studentButton.css";

export function StudentButton({ to, email, level }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/student/${to}`);
  };

  return (
    <button className="student-button" onClick={handleButtonClick}>
      <div className="student-button__content">
        <img
          src="/src/assets/student.png"
          alt="Estudiante"
          className="student-button__content-student"
        />
        <h2 className="student-button-email">{email}</h2>
      </div>

      <h1 className="student-button-level">{level}</h1>
    </button>
  );
}
