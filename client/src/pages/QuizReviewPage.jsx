import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import { QuestionType1Review } from "../components/QuestionType1Review";
import { QuestionType2Review } from "../components/QuestionType2Review";
import { QuestionType3Review } from "../components/QuestionType3Review";
import { QuizFooterReview } from "../components/QuizFooterReview";

import {
  getQuestions,
  getAnswersWithScores,
  getQuestionImages,
  getStudentAnswers,
} from "../hooks/useQuiz";

import { useAuth } from "../context/AuthContext";

export function QuizReviewPage() {
  const { token } = useAuth();
  const { quizId, studentId, classId } = useParams();

  // Información de las preguntas
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Obtener las preguntas
        const questionsList = await getQuestions(quizId, token);

        // Obtener las respuestas e imágenes para todas las preguntas en paralelo
        const questionsWithAnswersAndImages = await Promise.all(
          questionsList.map(async (question) => {
            const [answers, images] = await Promise.all([
              getAnswersWithScores(question.id, token),
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

        setQuestions(questionsWithAnswersAndImages);

        if (studentId) {
          // Obtener las respuestas del estudiante para todas las preguntas
          const studentAnswers = await getStudentAnswers(
            studentId,
            quizId,
            token
          );

          // Crear un array de userAnswers con la misma longitud que questionsList
          const userAnswersArray = new Array(questionsList.length).fill([]);

          // Llenar userAnswersArray con las respuestas del estudiante
          studentAnswers.forEach((answer) => {
            const index = questionsWithAnswersAndImages.findIndex(
              (question) => question.id === answer.questionId
            );
            if (index !== -1) {
              userAnswersArray[index] = answer.selectedAnswerIds;
            }
          });

          // Establecer userAnswers con userAnswersArray
          setUserAnswers(userAnswersArray);
        }
      } catch (error) {
        console.error("Error loading quiz", error);
      }
    };

    loadData();
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

  // Renderizar la pregunta actual
  const renderCurrentQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) {
      return null;
    }

    switch (currentQuestion.type) {
      case 1:
        return (
          <QuestionType1Review
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            studentId={studentId}
          />
        );
      case 2:
        return (
          <QuestionType2Review
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            studentId={studentId}
          />
        );
      case 3:
        return (
          <QuestionType3Review
            question={currentQuestion}
            selectedAnswers={userAnswers[currentQuestionIndex]}
            onAnswerSelect={handleAnswerSelect}
            studentId={studentId}
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
        <QuizFooterReview
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          goToQuestion={goToQuestion}
          onNext={nextQuestion}
          onPrev={prevQuestion}
          studentId={studentId}
          userAnswers={userAnswers}
        />
      </div>
    </div>
  );
}
