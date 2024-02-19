import { UserAchievement } from "../models/userAchievement-model.js";
import { authModel } from "../models/auth-model.js";

export class UserAchievementController {
  static getUserAchievements(req, res) {
    const userId = req.params.userId;

    UserAchievement.findAll({ where: { user_id: userId } })
      .then((userAchievements) => {
        res.json(userAchievements);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static async determineNewAchievements(userId, unlockedAchievements) {
    try {
      const newAchievements = [];
      for (const achievement of unlockedAchievements) {
        const existingUserAchievement = await UserAchievement.findOne({
          where: {
            user_id: userId,
            achievement_id: achievement.id,
          },
        });
        if (!existingUserAchievement) {
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
      // Guardar los nuevos logros desbloqueados para el usuario
      await UserAchievement.bulkCreate(
        newAchievements.map((achievement) => ({
          user_id: userId,
          achievement_id: achievement.id,
        }))
      );
    } catch (error) {
      console.error("Error saving user achievements:", error);
      throw new Error("Error saving user achievements");
    }
  }

  static async getAllUserAchievements(userEmail, achievements) {
    try {
      // Obtener el usuario por su correo electrónico
      const user = await authModel.findOne({
        where: { email: userEmail },
      });

      if (!user) {
        throw new Error("User not found");
      }

      // Obtener los logros desbloqueados por el usuario
      const userAchievements = await UserAchievement.findAll({
        where: { user_id: user.id },
      });

      // Marcar cada logro como desbloqueado o no desbloqueado
      const achievementsWithStatus = achievements.map((achievement) => {
        const isUnlocked = userAchievements.some(
          (userAchievement) => userAchievement.achievement_id === achievement.id
        );
        return { ...achievement.dataValues, unlocked: isUnlocked };
      });

      return achievementsWithStatus;
    } catch (error) {
      console.error("Error getting user achievements:", error);
      throw new Error("Error getting user achievements");
    }
  }
}
