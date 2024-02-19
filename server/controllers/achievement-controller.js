import { Achievement } from "../models/achievement-model.js";

import { UserAchievementController } from "./userAchievement-controller.js";

export class AchievementController {
  static getAchievements(req, res) {
    Achievement.findAll()
      .then((achievements) => {
        res.json(achievements);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static async getUserAchievements(req, res) {
    const userEmail = req.params.userEmail;

    try {
      // Obtener todos los logros disponibles
      const allAchievements = await Achievement.findAll();

      // Obtener los logros desbloqueados por el usuario
      const userAchievements =
        await UserAchievementController.getAllUserAchievements(
          userEmail,
          allAchievements
        );

      // Marcar cada logro como desbloqueado o no desbloqueado
      // const achievementsWithStatus = allAchievements.map((achievement) => {
      //   const isUnlocked = userAchievements.some(
      //     (userAchievement) => userAchievement.achievement_id === achievement.id
      //   );
      //   return { ...achievement.dataValues, unlocked: isUnlocked };
      // });

      res.json(userAchievements);
    } catch (error) {
      console.error("Error getting achievements with user status:", error);
      throw new Error("Error getting achievements with user status");
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
