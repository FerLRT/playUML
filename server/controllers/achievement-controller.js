import { Achievement } from "../models/achievement-model.js";

import { UserAchievementController } from "./userAchievement-controller.js";
import { sequelize } from "../config/dbConfig.js";

import { categoryModel } from "../models/category-model.js";
import { userQuizModel } from "../models/userQuiz-model.js";
import { QuizController } from "./quiz-controller.js";
import { AuthController } from "./auth-controller.js";
import { UserQuizController } from "./userQuiz-controller.js";

import Sequelize from "sequelize";

export class AchievementController {
  static async getAchievements(req, res) {
    try {
      const achievements = await Achievement.findAll();
      res.json(achievements);
    } catch (error) {
      console.error("Error getting achievements:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async getUserAchievements(req, res) {
    try {
      const userId = req.params.userId;

      // Obtener todos los logros
      const allAchievements = await Achievement.findAll();

      // Obtener los logros desbloqueados del usuario
      const userAchievements =
        await UserAchievementController.getAllUserAchievements(
          userId,
          allAchievements
        );

      res.json(userAchievements);
    } catch (error) {
      console.error("Error getting user achievements:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async calculateUnlockedAchievements(
    userId,
    quizId,
    quizScore,
    lastQuizScore
  ) {
    try {
      const unlockedAchievements = [];

      // Número de categorias completadas y número total de categorias
      const { completedCategories, allCategories } =
        await AchievementController.getUserCompletedCategories(userId);

      if (completedCategories !== undefined) {
        if (completedCategories == allCategories - 1) {
          unlockedAchievements.push(
            ...(await Achievement.findAll({ where: { type: 1 } }))
          );
        } else if (completedCategories / allCategories >= 0.5) {
          unlockedAchievements.push(
            ...(await Achievement.findAll({
              where: { type: 1, requirement: { [Sequelize.Op.lte]: 2 } },
            }))
          );
        } else if (completedCategories === 1) {
          unlockedAchievements.push(
            await Achievement.findOne({
              where: { type: 1, requirement: 1 },
            })
          );
        }
      }

      // Nota del test
      const score = quizScore;

      if (score >= 9) {
        unlockedAchievements.push(
          ...(await Achievement.findAll({
            where: { type: 2, requirement: { [Sequelize.Op.gt]: 2 } },
          }))
        );
      } else if (score >= 7) {
        unlockedAchievements.push(
          ...(await Achievement.findAll({
            where: {
              type: 2,
              requirement: { [Sequelize.Op.gt]: 2, [Sequelize.Op.lte]: 7 },
            },
          }))
        );
      } else if (score >= 5) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 2, requirement: 5 } })
        );
      } else if (score < 2) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 2, requirement: 2 } })
        );
      }

      // Con el quizId obtener número de veces que ha repetido el quiz
      const quizAttempts = await userQuizModel.findOne({
        where: { user_id: userId, quiz_id: quizId },
        attributes: ["attempts"],
      });

      if (quizAttempts.dataValues.attempts === 2) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 3, requirement: 2 } })
        );
      } else if (quizAttempts.dataValues.attempts === 3) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 3, requirement: 3 } })
        );
      } else if (quizAttempts.dataValues.attempts === 5) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 3, requirement: 5 } })
        );
      }

      // Número de tests completados y número total de tests
      const { averageScore, numQuizzes } = await AuthController.getUserStats(
        userId
      );
      const allQuizzes = await QuizController.getTotalQuizzes();

      if (numQuizzes == allQuizzes) {
        unlockedAchievements.push(
          ...(await Achievement.findAll({ where: { type: 4 } }))
        );
      } else if (numQuizzes / allQuizzes >= 0.5) {
        unlockedAchievements.push(
          ...(await Achievement.findAll({
            where: { type: 4, requirement: { [Sequelize.Op.lte]: 2 } },
          }))
        );
      } else if (numQuizzes == 1) {
        unlockedAchievements.push(
          await Achievement.findOne({ where: { type: 4, requirement: 1 } })
        );
      }

      // Comprobar nota anterior y nota actual para ver si ha mejorado
      if (lastQuizScore !== null) {
        const improvedScore = quizScore - lastQuizScore;

        if (improvedScore >= 4) {
          unlockedAchievements.push(
            ...(await Achievement.findAll({
              where: { type: 5, requirement: 1 },
            }))
          );
        }
      }

      // Si ha completado todos los tests comprobar si ha aprobado todos
      const allQuizzesCompleted = await UserQuizController.getUserQuizzes(
        userId
      );

      if (allQuizzes === allQuizzesCompleted.length) {
        const allQuizzesPassed = allQuizzesCompleted.every(
          (quiz) => quiz.score >= 5
        );

        if (allQuizzesPassed) {
          unlockedAchievements.push(
            await Achievement.findOne({
              where: { type: 6, requirement: 1 },
            })
          );
        }
      }

      return unlockedAchievements;
    } catch (error) {
      console.error("Error calculating unlocked achievements:", error);
      throw new Error("Error calculating unlocked achievements");
    }
  }

  static async getUserCompletedCategories(userId) {
    let completedCategoriesNumber = 0;

    // Obtener las categorias completadas por el usuario
    const allCategories = await categoryModel.findAll();
    const allCategoriesNumber = allCategories.length;

    // Obtener los quizzes del usuario que están en la tabla userQuizzes
    const userQuizzes = await userQuizModel.findAll({
      where: { user_id: userId },
    });

    // Obtener todos los quizzes organizados por categorías
    const quizzesByCategories = await sequelize.query(`
          SELECT q.*, c.name AS category
          FROM quizzes q
          INNER JOIN quiz_category qc ON q.id = qc.quiz_id
          INNER JOIN categories c ON qc.category_id = c.id
        `);

    for (const category of allCategories) {
      // Filtrar los quizzes por la categoría actual
      const quizzesInCategory = quizzesByCategories
        .flat()
        .filter((quiz) => quiz.category === category.name);

      // Verificar si todos los quizzes de la categoría están completados por el usuario
      const allQuizzesCompleted = quizzesInCategory.every((quiz) => {
        return userQuizzes.some((userQuiz) => userQuiz.quiz_id === quiz.id);
      });

      // Si todos los quizzes de la categoría están completados, agregar la categoría al conjunto de completadas
      if (allQuizzesCompleted && category.name !== "Repaso") {
        ++completedCategoriesNumber;
      }
    }

    return {
      completedCategories: completedCategoriesNumber,
      allCategories: allCategoriesNumber,
    };
  }
}
