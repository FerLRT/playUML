import { answerModel } from "../models/answer-model.js";

import { QuizController } from "./quiz-controller.js";
import { AuthController } from "./auth-controller.js";
import { AchievementController } from "./achievement-controller.js";
import { UserAchievementController } from "./userAchievement-controller.js";

export class AnswerController {
  static async getAnswers(req, res) {
    try {
      const answers = await answerModel.findAll();
      res.json(answers);
    } catch (error) {
      console.error("Error getting answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getQuestionAnswers(req, res) {
    try {
      const questionId = req.params.id;

      const answers = await answerModel.findAll({
        where: { question_id: questionId },
        attributes: { exclude: ["score"] },
      });

      const answersWithBase64Data = await Promise.all(
        answers.map(async (answer) => {
          if (answer.answer_image !== null) {
            // Convertir answer_image a base64
            answer.answer_image = Buffer.from(answer.answer_image).toString(
              "base64"
            );
          }
          return answer;
        })
      );

      res.json(answersWithBase64Data);
    } catch (error) {
      console.error("Error getting question answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async postSubmitAnswers(req, res) {
    try {
      const userEmail = req.body.userEmail;
      const quizId = req.body.quizId;
      const answers = req.body.answers;

      // Obtener los puntos de conocimiento asociados al quiz
      const quizExperiencePoints =
        await QuizController.getExperiencePointsForQuiz(quizId);

      // Obtener el usuario
      const user = await AuthController.getUser(userEmail);

      // Calcular los nuevos puntos de experiencia y nivel del usuario
      const newPoints = user.experience_points + quizExperiencePoints;
      const newLevel = await AuthController.updateUserLevel(
        userEmail,
        newPoints
      );

      // Calcular el puntaje total sumando los puntajes individuales
      const scores = await AnswerController.getQuestionsScores(answers);
      const totalScore = scores.reduce((total, current) => total + current, 0);

      // Determinar los logros desbloqueados y guardarlos para el usuario
      const unlockedAchievements =
        await AchievementController.calculateUnlockedAchievements(newPoints);
      const newAchievements =
        await UserAchievementController.determineNewAchievements(
          user.id,
          unlockedAchievements
        );
      if (newAchievements.length > 0) {
        await UserAchievementController.saveUserAchievements(
          user.id,
          newAchievements
        );
      }

      res.status(200).json({
        totalScore: totalScore,
        scores: scores,
        level: newLevel,
        experience: newPoints,
        unlockedAchievements: newAchievements.map(
          (achievement) => achievement.name
        ),
      });
    } catch (error) {
      console.error("Error submitting answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getQuestionsScores(answers) {
    const scores = [];

    await Promise.all(
      answers.map(async (answer) => {
        try {
          const results = await answerModel.findAll({
            where: { question_id: answer.questionId },
          });
          results.forEach((result) => {
            scores.push({
              questionId: answer.questionId,
              answerId: result.id,
              score: result.score,
            });
          });
        } catch (error) {
          console.error("Error al obtener el puntaje de la respuesta:", error);
        }
      })
    );

    return scores;
  }
}
