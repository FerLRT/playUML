const answersModel = require("../models/answers");

const getQuestionAnswers = (req, res) => {
  const questionId = req.params.id;

  answersModel
    .getAnswersByQuestionId(questionId)
    .then((answers) => {
      res.json(answers);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error: " + err);
    });
};

const submitAnswers = (req, res) => {
  try {
    const { answers } = req.body.answers;
    const questionIds = answers;

    // Obtén las respuestas correctas para las preguntas del test
    answersModel
      .getCorrectAnswersForQuestions(questionIds)
      .then((correctAnswers) => {
        // Lógica para verificar las respuestas y calcular la puntuación
        const score = calculateScore(answers, correctAnswers);

        // Devuelve la puntuación final del usuario y la puntuación de cada respuesta
        res.json({ score, correctAnswers });
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  } catch (err) {
    res.status(500).send("Internal Server Error: " + err);
  }
};

const calculateScore = (userAnswers, answers) => {
  // Calcular la puntuación total
  const totalScore = userAnswers.reduce((accumulator, userAnswer) => {
    const { questionId, answerIds } = userAnswer;

    // Filtrar las respuestas correctas para la pregunta actual
    const answersForQuestion = answers.filter(
      (answer) => answer.questionId === questionId
    );

    // Sumar los puntajes correspondientes a las respuestas marcadas por el usuario
    const questionScore = answerIds.reduce((questionAccumulator, answerId) => {
      const matchingAnswer = answersForQuestion.find(
        (answer) => answer.answerId === answerId
      );

      return questionAccumulator + (matchingAnswer ? matchingAnswer.score : 0);
    }, 0);

    return accumulator + questionScore;
  }, 0);

  return totalScore;
};

module.exports = {
  getQuestionAnswers,
  submitAnswers,
};
