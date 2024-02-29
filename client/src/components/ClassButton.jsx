import { React } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/classButton.css";

export function ClassButton({ to, label }) {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${to}`);
  };

  return (
    <button className="class-button" onClick={handleButtonClick}>
      {label}
    </button>
  );
}
