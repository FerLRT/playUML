import { quizModel } from "../models/quiz-model.js";

export class QuizController {
  static getQuizzes(req, res) {
    quizModel
      .findAll()
      .then((quizzes) => {
        res.json(quizzes);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static getQuiz(req, res) {
    const quizId = req.params.id;

    quizModel
      .findByPk(quizId)
      .then((quiz) => {
        if (quiz) {
          res.json(quiz);
        } else {
          res.status(404).send("Quiz not found");
        }
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static async getExperiencePointsForQuiz(quizId) {
    try {
      const quiz = await quizModel.findByPk(quizId);
      if (!quiz) {
        throw new Error("Quiz not found");
      }
      return quiz.experience_points;
    } catch (error) {
      console.error("Error getting experience points for quiz:", error);
      throw new Error("Error getting experience points for quiz");
    }
  }
}
