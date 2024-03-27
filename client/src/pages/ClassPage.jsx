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
  const [classStats, setClassStats] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const classData = await getClassName(classId);
        setClassName(classData.name);

        const studentsList = await getClassStudents(classId);
        setStudents(studentsList);

        const averageScore = await getClassAverageScore(classId);
        setAverageScore(averageScore);

        const classPercentage = await getClassPercentage(classId);
        setClassPercentage(classPercentage);

        const quizzes = await getQuizzes(user.id);
        setQuizzes(quizzes);

        const classStats = await getClassStats(classId);
        setClassStats(classStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [classId]);

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

  return (
    <div className="class-page">
      <h1>{className}</h1>

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
              />
            ))}
          </ul>
        </div>
      </ModalSide>
    </div>
  );
}
