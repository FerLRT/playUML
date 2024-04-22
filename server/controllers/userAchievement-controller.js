import { UserAchievement } from "../models/userAchievement-model.js";

import { AuthController } from "./auth-controller.js";

export class UserAchievementController {
  static async getUserAchievements(req, res) {
    try {
      const userId = req.params.userId;
      const userAchievements = await UserAchievement.findAll({
        where: { user_id: userId },
      });

      res.json(userAchievements);
    } catch (err) {
      console.error("Error fetching user achievements:", err);
      res.status(500).send("Internal Server Error: " + err.message);
    }
  }

  static async determineNewAchievements(userId, unlockedAchievements) {
    try {
      const newAchievements = [];

      // Obtener los ids de los logros desbloqueados
      const unlockedAchievementIds = unlockedAchievements.map(
        (achievement) => achievement.id
      );

      // Buscar los logros desbloqueados que el usuario aún no tiene
      const existingUserAchievements = await UserAchievement.findAll({
        where: {
          user_id: userId,
          achievement_id: unlockedAchievementIds,
        },
      });

      // Filtrar los logros desbloqueados que el usuario aún no tiene
      for (const achievement of unlockedAchievements) {
        const isAchievementUnlocked = existingUserAchievements.some(
          (userAchievement) => userAchievement.achievement_id === achievement.id
        );
        if (!isAchievementUnlocked) {
          newAchievements.push(achievement);
        }
      }

      return newAchievements;
    } catch (error) {
      console.error("Error determining new achievements:", error);
      throw new Error("Error determining new achievements");
    }
  }

  static async saveUserAchievements(userId, newAchievements) {
    try {
      // Mapear los nuevos logros desbloqueados para el usuario
      const achievementsToSave = newAchievements.map((achievement) => ({
        user_id: userId,
        achievement_id: achievement.id,
      }));

      // Guardar los nuevos logros desbloqueados para el usuario
      await UserAchievement.bulkCreate(achievementsToSave);
    } catch (error) {
      console.error("Error saving user achievements:", error);
      throw new Error("Error saving user achievements");
    }
  }

  static async getAllUserAchievements(userId, achievements) {
    try {
      if (!userId) {
        throw new Error("User not found");
      }

      // Obtener los IDs de logros desbloqueados por el usuario
      const userAchievementIds = (
        await UserAchievement.findAll({
          where: { user_id: userId },
          attributes: ["achievement_id"],
        })
      ).map((userAchievement) => userAchievement.achievement_id);

      // Marcar cada logro como desbloqueado o no desbloqueado
      const achievementsWithStatus = achievements.map((achievement) => ({
        ...achievement,
        unlocked: userAchievementIds.includes(achievement.id),
      }));

      return achievementsWithStatus;
    } catch (error) {
      console.error("Error getting user achievements:", error);
      throw new Error("Error getting user achievements");
    }
  }
}
