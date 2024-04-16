import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { QuizButtonReview } from "../components/QuizButtonReview";
import { ModalSide } from "../components/ModalSide";
import { StudentButton } from "../components/StudentButton";
import { Ranking } from "../components/Ranking";
import { StatButton } from "../components/StatButton";

import {
  getClassStudents,
  getClassAverageScore,
  getClassPercentage,
  getClassName,
  addStudentToClass,
  removeStudentFromClass,
} from "../hooks/useClass";
import { getClassStats } from "../hooks/useQuiz";
import { getQuizzes } from "../hooks/useQuiz";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

import "../styles/classPage.css";

export function ClassPage() {
  const { user } = useAuth();
  const { classId } = useParams();

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [classPercentage, setClassPercentage] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [classStats, setClassStats] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isNewStudentModalVisible, setIsNewStudentModalVisible] =
    useState(false);

  const [newStudentEmail, setNewStudentEmail] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  const [newStudentError, setNewStudentError] = useState("");

  useEffect(() => {
    const fetchData = () => {
      Promise.all([
        getClassName(classId),
        getClassStudents(classId),
        getClassAverageScore(classId),
        getClassPercentage(classId),
        getQuizzes(user.id),
        getClassStats(classId),
      ])
        .then(
          ([
            classData,
            studentsList,
            averageScore,
            classPercentage,
            quizzes,
            classStats,
          ]) => {
            setClassName(classData.data.name);
            setStudents(studentsList.data);
            setAverageScore(averageScore.data);
            setClassPercentage(classPercentage.data);
            setQuizzes(quizzes.data);
            setClassStats(classStats.data);
          }
        )
        .catch((error) => {
          setError("Se ha producido un error cargando los datos de la clase.");
        });
    };

    fetchData();
  }, [classId]);

  const handleButtonAddStudent = () => {
    setIsNewStudentModalVisible(true);
    setNewStudentError("");
  };

  const handlerAddStudent = async () => {
    if (!newStudentEmail) {
      setNewStudentError("Debes ingresar un correo electrónico");
      return;
    }

    setIsLoading(true);

    await addStudentToClass(classId, newStudentEmail)
      .then((response) => {
        const { newStudent, userCredentials, fileName } = response.data;

        setStudents([...students, newStudent]);
        setIsNewStudentModalVisible(false);
        setNewStudentEmail("");

        const jsonBlob = new Blob([JSON.stringify(userCredentials)], {
          type: "application/json",
        });

        const downloadLink = document.createElement("a");
        downloadLink.href = URL.createObjectURL(jsonBlob);
        downloadLink.download = fileName;

        downloadLink.click();
      })
      .catch((error) => {
        setNewStudentError(
          "Error al añadir estudiante a la clase. Comprueba que el correo electrónico sea correcto o intentalo de nuevo más tarde."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const getTestCountByCategory = (category) => {
    if (!classStats.length) return 0;

    return classStats.reduce((acc, stat) => {
      const quiz = quizzes.find((quiz) => quiz.id === stat.quiz_id);
      if (quiz && quiz.category === category) {
        return acc + parseInt(stat.numStudents);
      }
      return acc;
    }, 0);
  };

  const handleRemoveStudent = async (studentId) => {
    await removeStudentFromClass(studentId);

    // Filtrar la lista de estudiantes para eliminar al estudiante eliminado
    const updatedStudents = students.filter(
      (student) => student.id !== studentId
    );

    // Actualizar el estado con la nueva lista de estudiantes
    setStudents(updatedStudents);
  };

  return (
    <div className="class-page">
      <Stack sx={{ width: "100%", marginBottom: "10px" }} spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
      </Stack>

      <div className="class-page-header">
        <h1>{className}</h1>

        <button className="button-basic" onClick={handleButtonAddStudent}>
          Añadir estudiante
        </button>
      </div>

      <div className="class-page-button-container">
        <StatButton
          image_src="/src/assets/grupo.png"
          stat="Estudiantes"
          value={students.length}
          openModal={() => setIsModalVisible(true)}
        />

        <StatButton
          image_src="/src/assets/medalla.png"
          stat="Nota media"
          value={
            isNaN(averageScore) || averageScore === null
              ? "--"
              : `${averageScore}/10`
          }
          openModal={null}
        />

        <StatButton
          image_src="/src/assets/aceptar.png"
          stat="Completado"
          value={`${classPercentage}%`}
          openModal={null}
        />
      </div>

      <Ranking classId={classId} userId={user.id} userRole={user.role} />

      <h1>Tests</h1>
      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="class-page-search-bar"
      />

      {Object.entries(
        quizzes.reduce((acc, quiz) => {
          const { category } = quiz;
          if (!acc[category]) {
            acc[category] = [];
          }
          acc[category].push(quiz);
          return acc;
        }, {})
      ).map(([category, categoryQuizzes]) => (
        <details className="category-quizzes-group" key={category} open>
          <summary>
            <h2>
              {category} ({getTestCountByCategory(category)}/
              {students.length * categoryQuizzes.length})
            </h2>
          </summary>
          <div className="category-quizzes">
            {categoryQuizzes
              .filter((quiz) =>
                quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((quiz) => {
                const quizStats = classStats.find(
                  (stat) => stat.quiz_id === quiz.id
                );
                return (
                  <QuizButtonReview
                    key={quiz.id}
                    to={quiz.id}
                    classId={classId}
                    className={quiz.name}
                    numResolveStudents={quizStats ? quizStats.numStudents : 0}
                    numStudents={students.length}
                    averageScore={quizStats ? quizStats.avgScore : 0}
                  />
                );
              })}
          </div>
        </details>
      ))}

      <ModalSide
        isModalVisible={isModalVisible}
        closeModal={() => setIsModalVisible(false)}
      >
        <div className="class-page-modalside">
          <h2>Lista de estudiantes</h2>
          <ul>
            {students.map((student) => (
              <StudentButton
                key={student.id}
                to={student.id}
                email={student.email}
                level={student.level}
                last_connection={student.last_connection}
                handleRemoveStudent={handleRemoveStudent}
                setStudents={setStudents} // Pasar la función setStudents como prop
              />
            ))}
          </ul>
        </div>
      </ModalSide>

      <ModalSide
        isModalVisible={isNewStudentModalVisible}
        closeModal={() => setIsNewStudentModalVisible(false)}
      >
        <div className="class-page-modalside">
          <h2>Añadir nuevo estudiante</h2>

          <div className="class-page-modalside-new-student">
            <h3>Correo del nuevo estudiante:</h3>
            <input
              type="email"
              placeholder="Correo"
              value={newStudentEmail}
              onChange={(e) => setNewStudentEmail(e.target.value)}
            />
          </div>

          <Stack sx={{ width: "100%" }} spacing={2}>
            {newStudentError && (
              <Alert severity="error">{newStudentError}</Alert>
            )}
          </Stack>

          <div className="class-page-modalside-button-container">
            {isLoading ? (
              <div className="loader"></div>
            ) : (
              <button className="button-basic" onClick={handlerAddStudent}>
                Añadir
              </button>
            )}
          </div>
        </div>
      </ModalSide>
    </div>
  );
}
