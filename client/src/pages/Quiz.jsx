import React, { useState, useEffect } from "react";
import {
  fetchQuestions,
  fetchAnswersByQuestionId,
  submitAnswers,
} from "../services/api";
import Header from "../components/Header";
import QuestionType1 from "../components/QuestionType1";
import QuestionType2 from "../components/QuestionType2";
import QuestionType3 from "../components/QuestionType3";
import Footer from "../components/Footer";
import "../styles/Quiz.css";

function Quiz() {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);

  useEffect(() => {
    fetchQuestions(1).then((response) => {
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
        setUserAnswers(new Array(combinedQuestions.length).fill(null));
      });
    });
  }, []);

  const isNextButtonDisabled = () => {
    // Devuelve true si el usuario no ha marcado una respuesta para la pregunta actual
    return userAnswers[currentIndex] === null;
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(currentIndex + 1); // Para que el footer cambie a "Finalizar"

      // En este punto, el usuario ha completado el cuestionario y transformamos las respuestas a un JSON para enviar al server y obtener el resultado
      const selectedAnswersIds = () => {
        const answersJson = {
          answers: [],
        };

        userAnswers.forEach((selectedAnswerId, index) => {
          if (selectedAnswerId !== null) {
            // Agrega la respuesta al JSON
            answersJson.answers.push({
              questionId: questions[index].id,
              answerId: selectedAnswerId,
            });
          }
        });

        return answersJson;
      };

      const selectedAnswers = selectedAnswersIds();

      submitAnswers(selectedAnswers)
        .then((response) => {
          // Manejar la respuesta del servidor (puntuación, retroalimentación, etc.)
          const score = response.score;
          alert(`Puntuación: ${score}/${questions.length}`);
        })
        .catch((err) => {
          console.log(err);
          alert("Error al enviar respuestas al servidor", err);
        });
    }
  };

  const handleAnswerSelect = (selectedAnswerId) => {
    const updatedUserAnswers = [...userAnswers];
    updatedUserAnswers[currentIndex] = selectedAnswerId;
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
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            isNextButtonDisabled={isNextButtonDisabled}
            currentIndex={currentIndex}
            questions={questions}
          />
        );
      case 2:
        return (
          <QuestionType2
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            isNextButtonDisabled={isNextButtonDisabled}
            currentIndex={currentIndex}
            questions={questions}
          />
        );
      case 3:
        return (
          <QuestionType3
            question={currentQuestion}
            onAnswerSelect={handleAnswerSelect}
            onNextButtonClick={handleNext}
            isNextButtonDisabled={isNextButtonDisabled}
            currentIndex={currentIndex}
            questions={questions}
          />
        );
      default:
        return <div>Error: Tipo de pregunta no reconocido</div>;
    }
  };

  const handleCircleClick = (index) => {
    if (index < questions.length) {
      setCurrentIndex(index);
    }
  };

  return (
    <div className="quiz-page">
      <Header />
      {renderQuestion()}
      <Footer
        questions={questions}
        currentIndex={currentIndex}
        userAnswers={userAnswers}
        onCircleClick={handleCircleClick}
      />
    </div>
  );
}

export default Quiz;
