import { questionModel } from "../models/question-model.js";

export class QuestionController {
  static getQuestions(req, res) {
    questionModel
      .findAll()
      .then((questions) => {
        res.json(questions);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static getQuizQuestions(req, res) {
    const quizId = req.params.id;

    questionModel
      .findAll({ where: { quiz_id: quizId } })
      .then((questions) => {
        res.json(questions);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }
}
