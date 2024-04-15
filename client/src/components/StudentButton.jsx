import { React, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { RiMore2Fill } from "react-icons/ri";
import moment from "moment";
import "moment/locale/es";
moment.locale("es");
import "../styles/studentButton.css";

export function StudentButton({
  to,
  email,
  level,
  last_connection,
  handleRemoveStudent,
  setStudents,
}) {
  const { classId } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [showMenu, setShowMenu] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Agregar un manejador de eventos para cerrar el menú cuando se hace clic fuera de él
    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    }

    // Agregar el manejador de eventos al documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpiar el manejador de eventos al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

  const handleMenuClick = (event) => {
    event.stopPropagation(); // Evitar que el clic llegue al button y cierre el menú
    const containerRect = containerRef.current.getBoundingClientRect();
    setMenuPosition({
      x: event.clientX - containerRect.left - 100,
      y: event.clientY - containerRect.top,
    });
    setShowMenu(!showMenu);
  };

  const handleMenuItemClick = async () => {
    // Eliminar estudiante
    handleRemoveStudent(to);

    // Llamar a la función setStudents para actualizar el estado de los estudiantes
    setStudents((prevStudents) =>
      prevStudents.filter((student) => student.id !== to)
    );

    setShowMenu(false);
  };

  return (
    <div className="student-button-wrapper" ref={containerRef}>
      <div className="student-button-container">
        <button
          className="student-button"
          onClick={handleButtonClick}
          title={email}
        >
          <div className="student-button__content-img">
            <img
              src="/src/assets/student.png"
              alt="Estudiante"
              className="student-button__content-student"
            />
          </div>

          <div className="student-button__content-name">{email}</div>

          <div className="student-button__content-info">
            <p className="student-button-last-connection">
              {formattedLastConnection(last_connection)}
            </p>
            <h1 className="student-button-level">{level}</h1>
          </div>
        </button>
        <div className="student-button-menu" onClick={handleMenuClick}>
          <RiMore2Fill />
        </div>
      </div>
      {showMenu && (
        <div
          className="student-button-menu-options"
          style={{ top: menuPosition.y, left: menuPosition.x }}
        >
          <p onClick={() => handleMenuItemClick()}>Eliminar</p>
        </div>
      )}
    </div>
  );
}
