import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { QuizButtonReview } from "../components/QuizButtonReview";
import { ModalSide } from "../components/ModalSide";

import {
  getClassStudents,
  getClassAverageScore,
  getClassPercentage,
} from "../hooks/useClass";
import { getClassStats } from "../hooks/useQuiz";
import { getQuizzes } from "../hooks/useQuiz";

import "../styles/classPage.css";

export function ClassPage() {
  const { classId } = useParams();

  const [students, setStudents] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [classPercentage, setClassPercentage] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [classStats, setClassStats] = useState([{}]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

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

    const loadAverageScore = async () => {
      try {
        const averageScore = await getClassAverageScore(classId);
        setAverageScore(averageScore);
      } catch (error) {
        console.error("Error loading average score", error);
      }
    };

    const loadClassPercentage = async () => {
      try {
        const classPercentage = await getClassPercentage(classId);
        setClassPercentage(classPercentage);
      } catch (error) {
        console.error("Error loading class percentage", error);
      }
    };

    const loadQuizzes = async () => {
      try {
        const quizzes = await getQuizzes();
        setQuizzes(quizzes);
      } catch (error) {
        console.error("Error loading quizzes", error);
      }
    };

    const loadClassStats = async () => {
      try {
        const classStats = await getClassStats(classId);
        setClassStats(classStats);
      } catch (error) {
        console.error("Error loading class stats", error);
      }
    };

    loadStudents();
    loadAverageScore();
    loadClassPercentage();
    loadQuizzes();
    loadClassStats();
  }, [classId]);

  // Lógica para filtrar la lista de tests
  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  const classStatsObject = classStats.reduce((acc, curr) => {
    acc[curr.quiz_id] = curr.numstudents;
    return acc;
  }, {});

  return (
    <div className="class-page">
      <h1>Estadísticas</h1>
      <div className="class-page-button-container">
        <button className="class-page-button-students" onClick={openModal}>
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

        <button className="class-page-button-students">
          <div className="class-page-button-avatar-container">
            <img
              className="class-page-button-avatar"
              src="/src/assets/medalla.png"
              alt="Grupo de estudiantes"
            />
          </div>
          <div className="class-page-button-text">
            <h1>{averageScore}/10</h1>
            <p>Nota media</p>
          </div>
        </button>

        <button className="class-page-button-students" onClick={openModal}>
          <div className="class-page-button-avatar-container">
            <img
              className="class-page-button-avatar"
              src="/src/assets/aceptar.png"
              alt="Grupo de estudiantes"
            />
          </div>
          <div className="class-page-button-text">
            <h1>{classPercentage}%</h1>
            <p>Completado</p>
          </div>
        </button>
      </div>

      <input
        type="text"
        placeholder="Buscar..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="class-page-search-bar"
      />

      {filteredQuizzes.map((quiz) => (
        <QuizButtonReview
          key={quiz.id}
          to={quiz.id}
          classId={classId}
          className={quiz.name}
          numResolveStudents={classStatsObject[quiz.id] || 0} // Usar la información de classStatsObject
          numStudents={students.length}
        />
      ))}

      <ModalSide isModalVisible={isModalVisible} closeModal={closeModal}>
        <h2>Lista de estudiantes</h2>
        <ul>
          {students.map((student) => (
            <ul key={student.id}>
              {student.email} Nivel:{student.level}
            </ul>
          ))}
        </ul>
      </ModalSide>
    </div>
  );
}
