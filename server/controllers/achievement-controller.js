import { Achievement } from "../models/achievement-model.js";

import { UserAchievementController } from "./userAchievement-controller.js";

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
      const userEmail = req.params.userEmail;

      // Obtener todos los logros
      const allAchievements = await Achievement.findAll();

      // Obtener los logros desbloqueados del usuario
      const userAchievements =
        await UserAchievementController.getAllUserAchievements(
          userEmail,
          allAchievements
        );

      res.json(userAchievements);
    } catch (error) {
      console.error("Error getting user achievements:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async calculateUnlockedAchievements(experiencePoints) {
    try {
      // Obtener todos los logros cuyos requisitos de puntos se cumplan
      const unlockedAchievements = await Achievement.findAll({
        // where: {
        //   requirement: {
        //     [Op.lte]: experiencePoints, // Obtener logros cuyo requisito sea menor o igual a los puntos de experiencia
        //   },
        // },
      });
      return unlockedAchievements;
    } catch (error) {
      console.error("Error calculating unlocked achievements:", error);
      throw new Error("Error calculating unlocked achievements");
    }
  }
}
