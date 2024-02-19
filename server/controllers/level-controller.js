import { levelModel } from "../models/level-model.js";

export class LevelController {
  static async getAllLevels() {
    try {
      const allLevels = await levelModel.findAll();
      if (!allLevels) {
        throw new Error("No levels found");
      }
      return allLevels;
    } catch (error) {
      console.error("Error getting all levels:", error);
      throw new Error("Error getting all levels");
    }
  }

  static async getRequiredPointsForLevel(req, res) {
    const { level } = req.params;

    try {
      const currentLevelData = await levelModel.findOne({
        where: { level_number: level },
      });

      if (!currentLevelData) {
        return res.status(404).json({ error: "Nivel no encontrado" });
      }

      const nextLevelNumber = parseInt(level) + 1;
      const nextLevelData = await levelModel.findOne({
        where: { level_number: nextLevelNumber },
      });

      const response = {
        current_level: {
          level_number: currentLevelData.level_number,
          required_points: currentLevelData.required_experience_points,
        },
        next_level: {
          level_number: nextLevelData ? nextLevelData.level_number : null,
          required_points: nextLevelData
            ? nextLevelData.required_experience_points
            : null,
        },
      };

      return res.json(response);
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static async getLevelData(currentLevel) {
    await levelModel
      .findOne({
        where: { level_number: currentLevel + 1 },
      })
      .then((levelData) => {
        if (!levelData) {
          throw new Error("Nivel no encontrado");
        }

        return levelData.required_experience_points;
      })
      .catch((error) => {
        console.error("Error getting level data:", error);
        throw new Error("Error getting level data");
      });
  }
}
