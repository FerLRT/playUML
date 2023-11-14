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

        // Devuelve la puntuación como respuesta
        res.json({ score });
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  } catch (err) {
    res.status(500).send("Internal Server Error: " + err);
  }
};

const calculateScore = (userAnswers, correctAnswers) => {
  // Filtrar las respuestas marcadas como correctas por el usuario
  const userCorrectAnswers = userAnswers.filter((userAnswer) => {
    // Convertir answerId a número para asegurar la comparación
    const userAnswerId = parseInt(userAnswer.answerId, 10);

    const matchingCorrectAnswer = correctAnswers.find(
      (correctAnswer) => correctAnswer.answerId === userAnswerId
    );

    return matchingCorrectAnswer !== undefined;
  });

  // Calcular la puntuación (número de respuestas correctas)
  const score = userCorrectAnswers.length;

  return score;
};

module.exports = {
  getQuestionAnswers,
  submitAnswers,
};
