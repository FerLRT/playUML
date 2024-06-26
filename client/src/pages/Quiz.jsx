import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import {
  getQuestions,
  getAnswers,
  getQuestionImages,
  submitAnswers,
  hasUserCompletedQuiz,
} from "../hooks/useQuiz";

import { QuestionType1 } from "../components/QuestionType1";
import { QuestionType2 } from "../components/QuestionType2";
import { QuestionType3 } from "../components/QuestionType3";
import { SummaryView } from "../components/SummaryQuiz";
import { QuizFooter } from "../components/QuizFooter";
import { NewAchievement } from "../components/NewAchievement";

import "../styles/quiz.css";

export function Quiz() {
  const { uid, token, user } = useAuth();
  const { quizId } = useParams();

  // Información de las preguntas
  const [questions, setQuestions] = useState([]);
  const [answersScore, setAnswersScore] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [newAchievements, setNewAchievements] = useState([]);
  const [studentQuizScore, setStudentQuizScore] = useState(0);

  // Estado del quiz y resumen
  const [quizCompleted, setQuizCompleted] = useState(false); // False: podemos seguir modifcarndo las respuestas, True: no podemos modificar las respuestas
  const [showSummaryView, setShowSummaryView] = useState(false); // False: no se muestra el resumen, True: se muestra el resumen
  const [sendAnswers, setSendAnswers] = useState(true); // False: no se han enviado las respuestas, True: se han enviado las respuestas

  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [posiblePoints, setPosiblePoints] = useState(0);

  const [sendingAnswers, setSendingAnswers] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(true);

  // Obtener los datos del quiz
  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener las preguntas
        const questionsList = await getQuestions(quizId, token);

        // Obtener las respuestas e imágenes para todas las preguntas en paralelo
        const questionsWithAnswersAndImages = await Promise.all(
          questionsList.map(async (question) => {
            const [answers, images] = await Promise.all([
              getAnswers(question.id, token),
              getQuestionImages(question.id, token),
            ]);

            // Inicializa userAnswers con la misma longitud que questions
            setUserAnswers(new Array(questionsList.length).fill([]));

            return {
              ...question,
              answers: answers,
              images: images,
            };
          })
        );

        // En caso de querer que solo se pueda realizar el test una vez
        // const { hasCompletedQuiz, userAnswersForQuiz, userAnswersScores } =
        //   await hasUserCompletedQuiz(user.email, quizId);

        const hasCompletedQuiz = false;
        const userAnswersForQuiz = [];
        const userAnswersScores = [];

        if (hasCompletedQuiz) {
          setSendAnswers(false);
          setQuizCompleted(hasCompletedQuiz);
          setUserAnswers(userAnswersForQuiz);
          setAnswersScore(userAnswersScores);
        }

        const questionsWithShuffledAnswers = questionsWithAnswersAndImages.map(
          (question) => {
            const shuffledAnswers = question.answers
              .slice()
              .sort(() => Math.random() - 0.5);
            return {
              ...question,
              answers: shuffledAnswers,
            };
          }
        );

        // Actualizar el estado con las respuestas e imágenes
        setQuestions(questionsWithShuffledAnswers);
      } catch (error) {
        console.error(
          "Error al cargar preguntas, respuestas e imágenes:",
          error
        );
      }
    };

    setSendAnswers(true);
    loadData();

    // Guardar la hora de inicio
    setStartTime(new Date());
  }, [quizId]);

  // Navegar a una pregunta específica
  const goToQuestion = (index) => {
    setCurrentQuestionIndex(index);
  };

  // Manejar la selección de respuestas
  const handleAnswerSelect = (selectedAnswerIds) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentQuestionIndex] = selectedAnswerIds;
    setUserAnswers(updatedUserAnswers);
  };

  // Botones siguiente y anterior del quiz-footer
  // Navegar a la siguiente pregunta
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navegar a la pregunta anterior
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Finalizar test
  const handleFinishQuiz = () => {
    setQuizCompleted(true);
    setShowSummaryView(true);
  };

  useEffect(() => {
    if (sendAnswers) {
      if (quizCompleted) {
        // Guardar la hora de finalización
        setEndTime(new Date());
        setSendingAnswers(true);

        // Preparar respuestas para enviar al servidor
        const preparedAnswers = [];

        questions.forEach((question, index) => {
          const questionId = question.id;
          const selectedAnswerIds = userAnswers[index];

          preparedAnswers.push({ questionId, selectedAnswerIds });
        });

        submitAnswers(uid, quizId, preparedAnswers, token)
          .then((response) => {
            // Response contiene scores y totalScore
            setAnswersScore(response.scores);
            user.experience_points = response.experience;
            user.level = response.level;
            setNewAchievements(response.unlockedAchievements);
            setStudentQuizScore(response.totalScore);
            setPosiblePoints(response.maxExperience);

            setSendingAnswers(false);
            setLoadingSummary(false);
          })
          .catch((error) => {
            console.error("Error al enviar respuestas:", error);
          });
      }
    }
  }, [quizCompleted]);

  const handleCloseAchievement = (achievementIndex) => {
    setNewAchievements((prevAchievements) => {
      // Eliminar el logro desbloqueado correspondiente del array
      const updatedAchievements = [...prevAchievements];
      updatedAchievements.splice(achievementIndex, 1);
      return updatedAchievements;
    });
  };

  // Preguntas marcadas con bandera
  const [flaggedQuestions, setFlaggedQuestions] = useState([]);

  const handleFlagToggle = (flagged) => {
    if (flagged) {
      setFlaggedQuestions([...flaggedQuestions, currentQuestionIndex]);
    } else {
      setFlaggedQuestions(
        flaggedQuestions.filter((index) => index !== currentQuestionIndex)
      );
    }
  };

  // Renderizar la pregunta actual
  const renderCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return null;
    }

    if (quizCompleted && showSummaryView) {
      return (
        <>
          {loadingSummary ? (
            <p>Cargando...</p>
          ) : (
            <SummaryView
              quizScore={studentQuizScore}
              startTime={startTime}
              endTime={endTime}
              posiblePoints={posiblePoints}
            />
          )}
        </>
      );
    }

    switch (currentQuestion.type) {
      case 1:
        return (
          <QuestionType1
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            onFlagToggle={handleFlagToggle}
            flagged={flaggedQuestions.includes(currentQuestionIndex)}
            quizCompleted={quizCompleted}
            answersScore={answersScore.filter(
              (score) => score.questionId === currentQuestion.id
            )}
          />
        );
      case 2:
        return (
          <QuestionType2
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            onFlagToggle={handleFlagToggle}
            flagged={flaggedQuestions.includes(currentQuestionIndex)}
            quizCompleted={quizCompleted}
            answersScore={answersScore.filter(
              (score) => score.questionId === currentQuestion.id
            )}
          />
        );
      case 3:
        return (
          <QuestionType3
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            onFlagToggle={handleFlagToggle}
            flagged={flaggedQuestions.includes(currentQuestionIndex)}
            quizCompleted={quizCompleted}
            answersScore={answersScore.filter(
              (score) => score.questionId === currentQuestion.id
            )}
          />
        );
      default:
        return <div>Error al cargar la pregunta</div>;
    }
  };

  return (
    <div className="quiz-container">
      <div className="quiz-question">{renderCurrentQuestion()}</div>

      <div className="quiz-footer">
        <QuizFooter
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          goToQuestion={goToQuestion}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          onFinish={handleFinishQuiz}
          flaggedQuestions={flaggedQuestions}
          quizCompleted={quizCompleted}
          setShowSummaryView={setShowSummaryView}
          userAnswers={userAnswers}
          answersScore={answersScore}
        />
      </div>

      {newAchievements.map((achievement, index) => (
        <NewAchievement
          key={index}
          open={true}
          onClose={() => handleCloseAchievement(index)}
          achievement={achievement}
        />
      ))}
    </div>
  );
}
