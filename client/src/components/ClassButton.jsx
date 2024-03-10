import { React } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/classButton.css";

export function ClassButton({ to, className, numStudents }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${to}`);
  };

  return (
    <button className="class-button" onClick={handleButtonClick}>
      <div className="class-button__content">
        <img
          src="/src/assets/grupo.png"
          alt="Clase"
          className="class-button__content-class"
        />
        <h2 className="class-button-name">{className}</h2>
      </div>
      <div className="class-button__content">
        <img
          src="/src/assets/student.png"
          alt="Estudiantes"
          className="class-button__content-student"
        />
        <h1 className="class-button-number">{numStudents}</h1>
        <h2>&rang;</h2>
      </div>
    </button>
  );
}
