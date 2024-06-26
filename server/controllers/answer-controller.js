import { answerModel } from "../models/answer-model.js";

import { QuizController } from "./quiz-controller.js";
import { AuthController } from "./auth-controller.js";
import { AchievementController } from "./achievement-controller.js";
import { UserAchievementController } from "./userAchievement-controller.js";
import { UserQuizController } from "./userQuiz-controller.js";

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

      res.json(answers);
    } catch (error) {
      console.error("Error getting question answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getQuestionAnswersWithScores(req, res) {
    try {
      const questionId = req.params.id;

      const answers = await answerModel.findAll({
        where: { question_id: questionId },
      });

      res.json(answers);
    } catch (error) {
      console.error("Error getting question answers:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async postSubmitAnswers(req, res) {
    try {
      const userId = req.body.userId;
      const quizId = req.body.quizId;
      const answers = req.body.answers;

      // Obtener los puntos de conocimiento asociados al quiz
      const quizExperiencePoints =
        await QuizController.getExperiencePointsForQuiz(quizId);

      // Obtener el usuario
      const user = await AuthController.getUserById(userId);

      // Calcular el puntaje total sumando los puntajes individuales
      const scores = await AnswerController.getQuestionsScores(answers);
      const totalScore = await AnswerController.calculateUserScore(
        answers,
        scores
      );

      // Número de intentos del quiz
      const { attempts, score } = await UserQuizController.getUserQuizAttempts(
        userId,
        quizId
      );

      let factor = 0;

      if (attempts < 10) {
        factor = 1 - attempts * 0.1;
      }

      // Calcular el porcentaje en función del totalScore
      const percentage =
        totalScore >= 0 && totalScore - score > 0
          ? ((totalScore - score) / 10) * 100 * factor
          : 0;

      // Calcular los nuevos puntos de experiencia y nivel del usuario
      const newPoints = parseInt(
        user.experience_points + (quizExperiencePoints * percentage) / 100
      );

      const newLevel = await AuthController.updateUserLevel(userId, newPoints);

      // Guardar el resultado del quiz y las respuestas del usuario
      const lastScore = await UserQuizController.createUserQuiz(
        user.id,
        quizId,
        totalScore,
        answers
      );

      // Determinar los logros desbloqueados y guardarlos para el usuario
      const unlockedAchievements =
        await AchievementController.calculateUnlockedAchievements(
          user.id,
          quizId,
          totalScore,
          lastScore
        );

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

      const maxExperience =
        totalScore >= 0 && totalScore - score > 0
          ? parseInt(
              user.experience_points +
                quizExperiencePoints * ((10 - score) / 10) * factor
            )
          : user.experience_points + quizExperiencePoints;

      res.status(200).json({
        totalScore: totalScore,
        scores: scores,
        level: newLevel,
        experience: newPoints,
        maxExperience: maxExperience,
        unlockedAchievements: newAchievements,
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

  static async calculateUserScore(answers, scores) {
    let totalScore = 0;
    let totalPossibleScore = 0;

    answers.forEach((answer) => {
      const questionScores = scores.filter(
        (score) => score.questionId === answer.questionId
      );

      answer.selectedAnswerIds.forEach((selectedAnswerId) => {
        const selectedAnswerScore = questionScores.find(
          (score) => score.answerId === selectedAnswerId
        );

        if (selectedAnswerScore) {
          totalScore += selectedAnswerScore.score;
        }
      });

      // Sumar solo los puntajes que son mayores que cero para el totalPossibleScore
      totalPossibleScore += questionScores.reduce((total, current) => {
        if (current.score > 0) {
          return total + current.score;
        }
        return total;
      }, 0);
    });

    // Normalizar la puntuación para obtener un valor entre 0 y 10
    const userScoreOutOfTen = (totalScore / totalPossibleScore) * 10;

    return userScoreOutOfTen.toFixed(2);
  }
}
