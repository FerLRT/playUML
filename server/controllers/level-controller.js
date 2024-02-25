import { levelModel } from "../models/level-model.js";

export class LevelController {
  static async getAllLevels() {
    try {
      const allLevels = await levelModel.findAll();
      if (allLevels.length === 0) {
        throw new Error("No levels found");
      }

      return allLevels;
    } catch (error) {
      console.error("Error getting all levels:", error);
      throw new Error("Error getting all levels");
    }
  }

  static async getRequiredPointsForLevel(req, res) {
    try {
      const level = req.params.level;

      // Buscar los datos del nivel actual
      const currentLevelData = await levelModel.findOne({
        where: { level_number: level },
      });

      if (!currentLevelData) {
        return res.status(404).send("Level not found");
      }

      const nextLevelNumber = parseInt(level) + 1;

      // Buscar los datos del próximo nivel
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

      res.json(response);
    } catch (error) {
      console.error("Error getting required points for level:", error);
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static async getLevelData(currentLevel) {
    try {
      const nextLevelData = await levelModel.findOne({
        where: { level_number: currentLevel + 1 },
      });

      if (!nextLevelData) {
        throw new Error("Next level data not found");
      }

      return nextLevelData.required_experience_points;
    } catch (error) {
      console.error("Error getting level data:", error);
      throw new Error("Error getting level data");
    }
  }
}
