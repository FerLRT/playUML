import { quizModel } from "../models/quiz-model.js";

import { userClassModel } from "../models/userClass-model.js";
import { userQuizModel } from "../models/userQuiz-model.js";

import { sequelize } from "../config/dbConfig.js";

export class QuizController {
  static async getQuizzes(req, res) {
    try {
      const quizzes = await quizModel.findAll();

      res.json(quizzes);
    } catch (error) {
      console.error("Error getting quizzes:", error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static async getQuiz(req, res) {
    try {
      const quizId = req.params.id;
      const quiz = await quizModel.findByPk(quizId);

      if (quiz) {
        res.json(quiz);
      } else {
        res.status(404).send("Quiz not found");
      }
    } catch (error) {
      console.error("Error getting quiz:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getClassStats(req, res) {
    try {
      const classId = req.params.id;

      // Obtener los quizzes asociados a la clase y el número de estudiantes que han completado cada quiz
      const quizStats = await sequelize.query(
        `
        SELECT uq.quiz_id, COUNT(uq.user_id) AS numStudents
        FROM user_quizzes uq
        INNER JOIN user_classes uc ON uq.user_id = uc.user_id
        WHERE uc.class_id = ${classId}
        GROUP BY uq.quiz_id;
      `
      );

      res.json(quizStats[0]);
    } catch (error) {
      console.error("Error fetching quiz stats by class:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }

  static async getExperiencePointsForQuiz(quizId) {
    try {
      const quiz = await quizModel.findByPk(quizId);
      if (!quiz) {
        throw new Error("Quiz not found with the provided ID");
      }

      return quiz.experience_points;
    } catch (error) {
      console.error("Error getting experience points for quiz:", error);
      throw new Error("Failed to retrieve experience points for the quiz");
    }
  }

  static async getTotalQuizzes() {
    try {
      const totalQuizzes = await quizModel.count();

      return totalQuizzes || 0;
    } catch (error) {
      console.error("Error getting total quizzes:", error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }
}
