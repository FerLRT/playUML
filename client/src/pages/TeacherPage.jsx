import React, { useState, useEffect } from "react";
import { getTeacherClasses, createClass } from "../hooks/useClass";
import { useAuth } from "../context/AuthContext";

import { FileImport } from "../components/FileImport";
import { ClassButton } from "../components/ClassButton";

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
      <h1>Teacher Page - Lista de clases</h1>

      <button onClick={openModal}>Crear Nueva Clase</button>

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

      <div className={`modal ${isModalVisible ? "modal-visible" : ""}`}>
        <div className="modal-content">
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Crear una nueva clase</h2>
          <h3>Nombre de la clase</h3>
          <input
            type="text"
            placeholder="Insertar nombre de la clase"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <FileImport onFileUpload={handleFileUpload} />
          <button onClick={handleCreateClass}>Crear Clase</button>
        </div>
      </div>

      <div
        className={`modal-background ${
          isModalVisible ? "background-visible" : ""
        }`}
        onClick={closeModal}
      />
    </div>
  );
}
