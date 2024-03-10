import React, { useState, useEffect } from "react";
import { getTeacherClasses, createClass } from "../hooks/useClass";
import { useAuth } from "../context/AuthContext";

import { FileImport } from "../components/FileImport";
import { ClassButton } from "../components/ClassButton";
import { ModalSide } from "../components/ModalSide";

import { validateJSONStructure } from "../utils/jsonValidator";

import "../styles/teacherPage.css";

export function TeacherPage() {
  const { user } = useAuth();
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [fileData, setFileData] = useState(null);

  useEffect(() => {
    getTeacherClasses(user.email).then((response) => {
      setTeacherClasses(response);
    });
  }, []);

  const filteredClasses = teacherClasses.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClass = async () => {
    try {
      // Comprobar que los parámetros no sean nulos o cadenas vacías
      if (!newClassName || !user || !user.email || !fileData) {
        console.error("Alguno de los parámetros es nulo o una cadena vacía");
        return;
      }

      // Llamar a la función de validación de JSON
      if (!validateJSONStructure(fileData)) {
        console.error("El JSON no tiene la estructura deseada");
        return;
      }

      const { newClass, usersCredentials, fileName } = await createClass(
        newClassName,
        user.email,
        fileData
      );
      setTeacherClasses([...teacherClasses, newClass]); // Agregar la nueva clase al estado local
      closeModal();

      const jsonBlob = new Blob([JSON.stringify(usersCredentials)], {
        type: "application/json",
      });

      // Crear un enlace de descarga para el Blob
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(jsonBlob);
      downloadLink.download = fileName;

      // Simular un clic en el enlace de descarga para iniciar la descarga del archivo
      downloadLink.click();
    } catch (error) {
      console.error("Error al crear la clase:", error);
    }
  };

  const handleFileUpload = (data) => {
    setFileData(data); // Actualizar el estado con los datos del archivo
  };

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setNewClassName("");
  };

  return (
    <div className="teacher-page-container">
      <div className="teacher-page-header">
        <h1>Mis clases</h1>
        <button onClick={openModal}>Nueva Clase</button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="teacher-page-search-bar"
      />

      <div className="teacher-page-classes">
        {filteredClasses.map((classItem) => (
          <ClassButton
            key={classItem.id}
            to={classItem.id}
            className={classItem.name}
            numStudents={classItem.numberOfStudents}
          />
        ))}
      </div>

      <ModalSide isModalVisible={isModalVisible} closeModal={closeModal}>
        <h2 className="teacher-page-modalside-title">Crear una nueva clase</h2>
        <h3 className="teacher-page-modalside-option">Nombre de la clase</h3>
        <input
          className="teacher-page-modalside-input"
          type="text"
          placeholder="Insertar nombre de la clase"
          value={newClassName}
          onChange={(e) => setNewClassName(e.target.value)}
        />

        <FileImport onFileUpload={handleFileUpload} />

        <button
          className="teacher-page-modalside-button"
          onClick={handleCreateClass}
        >
          Crear Clase
        </button>
      </ModalSide>
    </div>
  );
}
