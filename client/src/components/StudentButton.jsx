import { React } from "react";
import { useNavigate, useParams } from "react-router-dom";

import moment from "moment";
import "moment/locale/es";
moment.locale("es");

import "../styles/studentButton.css";

export function StudentButton({ to, email, level, last_connection }) {
  const { classId } = useParams();
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate(`/class/${classId}/student/${to}`);
  };

  // Función para formatear la fecha y hora
  const formattedLastConnection = (last_connection) => {
    if (!last_connection) {
      return "Nunca";
    }

    const now = moment();
    const connectionTime = moment(last_connection);
    const diff = now.diff(connectionTime, "milliseconds");
    const diffInMinutes = moment.duration(diff).asMinutes() - 60;

    if (diffInMinutes < 1) {
      return "Justo ahora";
    } else if (diffInMinutes < 60) {
      return `Hace ${Math.round(diffInMinutes)} minuto${
        Math.round(diffInMinutes).toFixed(0) != 1 ? "s" : ""
      }`;
    } else if (diffInMinutes < 1440) {
      return `Hace ${Math.floor(diffInMinutes / 60).toFixed(0)} hora${
        Math.floor(diffInMinutes / 60).toFixed(0) != 1 ? "s" : ""
      }`;
    } else {
      const diffInDays = diffInMinutes / 1440;
      const diffInMonths = diffInDays / 30;
      const diffInYears = diffInMonths / 12;

      if (diffInYears > 1) {
        return `Más de ${diffInYears.toFixed(0)} año${
          diffInYears.toFixed(0) != 1 ? "s" : ""
        }`;
      } else if (diffInMonths > 1) {
        return `Hace ${diffInMonths.toFixed(0)} mes${
          diffInMonths.toFixed(0) != 1 ? "es" : ""
        }`;
      } else if (diffInDays > 1) {
        return `Hace ${diffInDays.toFixed(0)} día${
          diffInDays.toFixed(0) != 1 ? "s" : ""
        }`;
      } else {
        return "Menos de un día";
      }
    }
  };

  return (
    <button className="student-button" onClick={handleButtonClick}>
      <div className="student-button__content">
        <img
          src="/src/assets/student.png"
          alt="Estudiante"
          className="student-button__content-student"
        />
        <p className="student-button-email">{email}</p>
      </div>

      <div className="student-button__content-info">
        <p className="student-button-last-connection">
          {formattedLastConnection(last_connection)}
        </p>
        <h1 className="student-button-level">{level}</h1>
      </div>
    </button>
  );
}
