import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  fetchQuestions,
  fetchAnswersByQuestionId,
  submitAnswers,
} from "../services/api";
import Header from "../components/Header";
import QuestionType1 from "../components/QuestionType1";
import QuestionType2 from "../components/QuestionType2";
import QuestionType3 from "../components/QuestionType3";
import SummaryView from "../components/SummaryView";
import Footer from "../components/Footer";
import "../styles/Quiz.css";

function Quiz() {
  const { quizId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answersScore, setAnswersScore] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

  useEffect(() => {
    fetchQuestions(quizId).then((response) => {
      const questionsList = response.data;
      const promises = questionsList.map((q) => {
        return fetchAnswersByQuestionId(q.id);
      });
      Promise.all(promises).then((answersList) => {
        const combinedQuestions = questionsList.map((question, index) => {
          return {
            ...question,
            answers: answersList[index].data,
          };
        });
        setQuestions(combinedQuestions);

        // Inicializa userAnswers con la misma longitud que questions
        setUserAnswers(new Array(combinedQuestions.length).fill([]));
      });
    });
  }, [quizId]);

  /* Marca cuando un test esta completado */
  useEffect(() => {
    if (quizCompleted) console.log("Test completado");
  }, [quizCompleted]);

  const renderContent = () => {
    if (showSummary) {
      // Renderizar la vista de resumen
      // Puedes crear un nuevo componente para la vista de resumen y pasarlo aquí
      return (
        <SummaryView
          questions={questions}
          userAnswers={userAnswers}
          answersScore={answersScore}
          totalScore={totalScore}
        />
      );
    } else {
      // Renderizar la pregunta actual
      return renderQuestion();
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(currentIndex + 1); // Para que el footer cambie a "Finalizar"

      // En este punto, el usuario ha completado el cuestionario y transformamos las respuestas a un JSON para enviar al server y obtener el resultado
      const selectedAnswersIds = userAnswers.map((selectedAnswerIds, index) => {
        return {
          questionId: questions[index].id,
          answerIds: selectedAnswerIds,
        };
      });

      const selectedAnswers = { answers: selectedAnswersIds };

      submitAnswers(selectedAnswers)
        .then((response) => {
          // Manejar la respuesta del servidor (puntuación, retroalimentación, etc.)
          setQuizCompleted(true);
          setTotalScore(response.score);
          setAnswersScore(response.correctAnswers);
          // alert(`Puntuación: ${score}/${questions.length}`);
          setShowSummary(true);
        })
        .catch((err) => {
          console.log(err);
          alert("Error al enviar respuestas al servidor", err);
        });
    }
  };

  const handleAnswerSelect = (selectedAnswerIds) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentIndex] = selectedAnswerIds;
    setUserAnswers(updatedUserAnswers);
  };

  const currentQuestion = questions[currentIndex];

  const renderQuestion = () => {
    if (!currentQuestion) return null;

    switch (currentQuestion.type) {
      case 1:
        return (
          <QuestionType1
            question={currentQuestion}
            letters={letters}
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            currentIndex={currentIndex}
            questions={questions}
            selectedAnswers={userAnswers[currentIndex]}
            quizCompleted={quizCompleted}
            answersScore={answersScore}
          />
        );
      case 2:
        return (
          <QuestionType2
            question={currentQuestion}
            letters={letters}
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            currentIndex={currentIndex}
            questions={questions}
            selectedAnswers={userAnswers[currentIndex]}
            quizCompleted={quizCompleted}
            answersScore={answersScore}
          />
        );
      case 3:
        return (
          <QuestionType3
            question={currentQuestion}
            letters={letters}
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            currentIndex={currentIndex}
            questions={questions}
            selectedAnswers={userAnswers[currentIndex]}
            quizCompleted={quizCompleted}
            answersScore={answersScore}
          />
        );
      default:
        return <div>Error: Tipo de pregunta no reconocido</div>;
    }
  };

  const handleCircleClick = (index) => {
    if (index < questions.length) {
      setCurrentIndex(index);
      setShowSummary(false); // Ocultar resumen al volver a una pregunta
    }
  };

  return (
    <div className="quiz-page">
      <Header />
      {renderContent()}
      <Footer
        questions={questions}
        currentIndex={currentIndex}
        userAnswers={userAnswers}
        onCircleClick={handleCircleClick}
        quizCompleted={quizCompleted}
        answersScore={answersScore}
        showSummary={showSummary}
        onSummaryButtonClick={() => setShowSummary(!showSummary)}
      />
    </div>
  );
}

export default Quiz;
