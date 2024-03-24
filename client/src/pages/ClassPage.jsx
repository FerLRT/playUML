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
} from "../hooks/useClass";
import { getClassStats } from "../hooks/useQuiz";
import { getQuizzes } from "../hooks/useQuiz";

import "../styles/classPage.css";

export function ClassPage() {
  const { user } = useAuth();
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
  const quizzesByCategory = quizzes.reduce((acc, quiz) => {
    const { category } = quiz;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(quiz);
    return acc;
  }, {});

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

  const classStatsByCategory = quizzes.reduce((acc, quiz) => {
    const { category, id } = quiz;
    const numResolveStudents = classStatsObject[id] || 0;
    if (!acc[category]) {
      acc[category] = {
        totalStudents: students.length,
        numResolveStudents: 0,
        numTests: 0,
      };
    }
    acc[category].numResolveStudents += parseInt(numResolveStudents);
    acc[category].numTests++;
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

      {Object.entries(quizzesByCategory).map(([category, categoryQuizzes]) => (
        <details className="category-quizzes-group" key={category} open>
          <summary>
            <h2>
              {category} (
              {parseInt(classStatsByCategory[category].numResolveStudents)}/
              {parseInt(classStatsByCategory[category].totalStudents) *
                classStatsByCategory[category].numTests}
              )
            </h2>
          </summary>
          <div className="category-quizzes">
            {categoryQuizzes
              .filter((quiz) =>
                quiz.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((quiz) => (
                <QuizButtonReview
                  key={quiz.id}
                  to={quiz.id}
                  classId={classId}
                  className={quiz.name}
                  numResolveStudents={classStatsObject[quiz.id] || 0}
                  numStudents={students.length}
                />
              ))}
          </div>
        </details>
      ))}

      <ModalSide isModalVisible={isModalVisible} closeModal={closeModal}>
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
              />
            ))}
          </ul>
        </div>
      </ModalSide>
    </div>
  );
}
