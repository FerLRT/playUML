import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
} from "../hooks/useClass";
import { getClassStats } from "../hooks/useQuiz";
import { getQuizzes } from "../hooks/useQuiz";

import "../styles/classPage.css";

export function ClassPage() {
  const { classId } = useParams();

  const [className, setClassName] = useState("");
  const [students, setStudents] = useState([]);
  const [averageScore, setAverageScore] = useState(0);
  const [classPercentage, setClassPercentage] = useState(0);
  const [quizzes, setQuizzes] = useState([]);
  const [classStats, setClassStats] = useState([{}]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const loadClassName = async () => {
      try {
        const classData = await getClassName(classId);
        setClassName(classData.name);
      } catch (error) {
        console.error("Error loading class name", error);
      }
    };

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

    loadClassName();
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
      <h1>{className}</h1>

      <div className="class-page-button-container">
        <StatButton
          image_src="/src/assets/grupo.png"
          stat="Estudiantes"
          value={students.length}
          openModal={openModal}
        />

        <StatButton
          image_src="/src/assets/medalla.png"
          stat="Nota media"
          value={`${averageScore}/10`}
          openModal={null}
        />

        <StatButton
          image_src="/src/assets/aceptar.png"
          stat="Completado"
          value={`${classPercentage}%`}
          openModal={null}
        />
      </div>

      <Ranking classId={classId} />

      <h1>Tests</h1>
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
            <StudentButton
              key={student.id}
              to={student.id}
              email={student.email}
              level={student.level}
            />
          ))}
        </ul>
      </ModalSide>
    </div>
  );
}
