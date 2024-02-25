import { questionModel } from "../models/question-model.js";

export class QuestionController {
  static async getQuestions(req, res) {
    try {
      const questions = await questionModel.findAll();

      res.json(questions);
    } catch (error) {
      console.error("Error fetching questions:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getQuizQuestions(req, res) {
    try {
      const quizId = req.params.id;

      const questions = await questionModel.findAll({
        where: { quiz_id: quizId },
      });

      res.json(questions);
    } catch (error) {
      console.error("Error fetching quiz questions:", error);
      res.status(500).send("Internal Server Error");
    }
  }
}
