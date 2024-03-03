import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getClassStudents } from "../hooks/useClass";

import "../styles/classPage.css";

export function ClassPage() {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);

  useEffect(() => {
    // Obtener estudiantes de la clase
    const loadStudents = async () => {
      try {
        const studentsList = await getClassStudents(classId);
        setStudents(studentsList);
      } catch (error) {
        console.error("Error loading students", error);
      }
    };

    loadStudents();
  }, [classId]);

  return (
    <div className="class-page">
      <h1>Estadísticas</h1>
      <div className="class-page-button-container">
        <button className="class-page-button-students">
          <div className="class-page-button-avatar-container">
            <img
              className="class-page-button-avatar"
              src="/src/assets/grupo.png"
              alt="Grupo de estudiantes"
            />
          </div>
          <div className="class-page-button-text">
            <h1>{students.length}</h1>
            <p>Estudiantes</p>
          </div>
        </button>
      </div>

      <div className="class-page-statistics">Estadisticas</div>
    </div>
  );
}
