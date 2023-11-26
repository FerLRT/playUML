const { getQuestionsByQuizId } = require("../models/questions");

const getQuizQuestions = (req, res) => {
  const quizId = req.params.id;

  getQuestionsByQuizId(quizId)
    .then((questions) => {
      res.status(200).json(questions);
    })
    .catch((err) => {
      res.status(500).send("Internal Server Error: ", err);
    });
};

module.exports = {
  getQuizQuestions,
};
