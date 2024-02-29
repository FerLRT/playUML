import React, { useState, useEffect } from "react";
import { getTeacherClasses } from "../hooks/useClass";
import { useAuth } from "../context/AuthContext";

import { FileImport } from "../components/FileImport";

import "../styles/teacherPage.css";
import { ClassButton } from "../components/ClassButton";

export function TeacherPage() {
  const { user } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Lógica para obtener la lista de clases del profesor
  useEffect(() => {
    getTeacherClasses(user.email).then((response) => {
      setTeacherClasses(response);
    });
  }, []);

  // Lógica para filtrar la lista de clases
  const filteredClasses = teacherClasses.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="teacher-page-container">
      <h1>Teacher Page - Lista de clases</h1>
      <FileImport />

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredClasses.map((classItem) => (
        <ClassButton
          key={classItem.id}
          to={classItem.id}
          label={classItem.name}
        />
      ))}
    </div>
  );
}
