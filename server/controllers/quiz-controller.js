import { quizModel } from "../models/quiz-model.js";

import { sequelize } from "../config/dbConfig.js";
import { UserQuestionAnswerController } from "./userQuestionAnswer-controller.js";
import { AuthController } from "./auth-controller.js";
import { UserClassController } from "./userClass-controller.js";

export class QuizController {
  static async getQuizzes(req, res) {
    try {
      // Realiza una consulta SQL para obtener los quizzes con información sobre sus categorías
      const quizzes = await sequelize.query(`
          SELECT q.*, c.name AS category
          FROM quizzes q
          INNER JOIN quiz_category qc ON q.id = qc.quiz_id
          INNER JOIN categories c ON qc.category_id = c.id
      `);

      res.json(quizzes[0]);
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

  static async getStudentAnswers(req, res) {
    try {
      const userId = req.params.userId;
      const quizId = req.params.id;

      const userAnswers =
        await UserQuestionAnswerController.getUserQuestionAnswers(
          userId,
          quizId
        );

      if (userAnswers) {
        res.json(userAnswers);
      } else {
        res.status(404).send("User answers not found");
      }
    } catch (error) {
      console.error("Error getting student answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getChartStats(req, res) {
    try {
      const userId = req.params.userId;
      const quizId = req.params.quizId;

      const user = await AuthController.getUserById(userId);
      const currentClassId = user.current_class_id;

      // Obtener los IDs de los usuarios en la clase actual del usuario
      const usersInClass = await UserClassController.getClassStudents(
        currentClassId
      );
      const userIdsInClass = usersInClass.map(
        (user) => user.dataValues.user_id
      );

      // Obtener el número total de estudiantes que han completado el quiz
      const completedQuizUsers = await sequelize.query(`
      SELECT DISTINCT user_id
      FROM user_quizzes
      WHERE quiz_id = ${quizId}
      AND user_id IN (${userIdsInClass.join(",")})
    `);
      const totalCompletedQuizUsers = completedQuizUsers[0].length;

      // Obtener las puntuaciones de los alumnos de la clase actual para el quiz dado
      const chartStats = await sequelize.query(`
        SELECT uq.score, COUNT(*) * 100.0 / ${totalCompletedQuizUsers} as percentage, COUNT(*) as numStudents
        FROM user_quizzes uq
        WHERE uq.user_id IN (${userIdsInClass.join(
          ","
        )}) AND uq.quiz_id = ${quizId}
        GROUP BY uq.score
        ORDER BY uq.score;
      `);

      // Redondear los puntajes a números enteros
      const roundedChartStats = chartStats[0].map((entry) => ({
        score: Math.round(entry.score),
        percentage: parseFloat(entry.percentage).toFixed(2), // Redondear el porcentaje a 2 decimales
        numStudents: parseFloat(entry.numstudents).toFixed(0), // Utilizar numstudents en minúsculas
      }));

      res.json(roundedChartStats);
    } catch (error) {
      console.error("Error getting chart stats:", error);
      res.status(500).send("Internal Server Error");
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
