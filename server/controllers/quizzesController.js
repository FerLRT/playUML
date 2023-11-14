const quizzesModel = require("../models/quizzes");

const getQuizzes = (req, res) => {
  quizzesModel
    .getQuizzes()
    .then((quizzes) => {
      res.json(quizzes);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error: " + err);
    });
};

const getQuiz = (req, res) => {
  const quizId = req.params.id;

  quizzesModel
    .getQuizById(quizId)
    .then((quiz) => {
      res.json(quiz);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error: " + err);
    });
};

module.exports = {
  getQuizzes,
  getQuiz,
};
