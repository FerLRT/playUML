import React, { useState, useEffect } from "react";
import { getTeacherClasses, createClass } from "../hooks/useClass";
import { useAuth } from "../context/AuthContext";

import { FileImport } from "../components/FileImport";
import { ClassButton } from "../components/ClassButton";
import { ModalSide } from "../components/ModalSide";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import { validateJSONStructure } from "../utils/jsonValidator";

import "../styles/teacherPage.css";

export function TeacherPage() {
  const { uid, token } = useAuth();

  const [teacherClasses, setTeacherClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [newClassName, setNewClassName] = useState("");
  const [fileData, setFileData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const [teacherClassesError, setTeacherClassesError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getTeacherClasses(uid, token)
      .then((response) => {
        setTeacherClasses(response.data);
      })
      .catch((error) => {
        setTeacherClassesError("Error al cargar las clases del profesor");
      });
  }, []);

  const filteredClasses = teacherClasses.filter((classItem) =>
    classItem.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateClass = async () => {
    if (!newClassName) {
      setError("Debes ponerle un nombre a la clase");
      return;
    }

    if (!fileData) {
      setError(
        "Debes incluir un archivo con la información de los estudiantes"
      );
      return;
    }

    if (!validateJSONStructure(fileData)) {
      setError("El archivo no contiene la estructura correcta");
      return;
    }

    setIsLoading(true);

    await createClass(newClassName, uid, fileData, token)
      .then((response) => {
        const { newClass, usersCredentials, fileName } = response.data;
        setTeacherClasses([...teacherClasses, newClass]);
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
      })
      .catch((error) => {
        setError("Error al crear la clase");
      })
      .finally(() => {
        setIsLoading(false);
      });
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

  const handleCloseError = () => {
    setTeacherClassesError("");
  };

  return (
    <div className="teacher-page-container">
      <Stack sx={{ width: "100%" }} spacing={2}>
        {teacherClassesError && (
          <Alert severity="error" onClose={handleCloseError}>
            {teacherClassesError}
          </Alert>
        )}
      </Stack>

      <div className="teacher-page-header">
        <h1>Mis clases</h1>
        <button className="button-basic" onClick={openModal}>
          Nueva Clase
        </button>
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
        <div className="teacher-page-modalside">
          <h2 className="teacher-page-modalside-title">
            Crear una nueva clase
          </h2>
          <h3 className="teacher-page-modalside-option">Nombre de la clase</h3>
          <input
            className="teacher-page-modalside-input"
            type="text"
            placeholder="Insertar nombre de la clase"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />

          <FileImport onFileUpload={handleFileUpload} />

          <Stack sx={{ width: "100%" }} spacing={2}>
            {error && <Alert severity="error">{error}</Alert>}
          </Stack>

          <div className="teacher-page-modalside-button-container">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <button className="button-basic" onClick={handleCreateClass}>
                Crear Clase
              </button>
            )}
          </div>
        </div>
      </ModalSide>
    </div>
  );
}
