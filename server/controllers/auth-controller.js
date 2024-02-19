import { authModel } from "../models/auth-model.js";
import { hashPassword, comparePassword } from "../utils/user-utils.js";
import { LevelController } from "./level-controller.js";

export class AuthController {
  static async signup(req, res) {
    const { email, password } = req.body;

    try {
      const hashedPassword = await hashPassword(password);
      const user = await authModel.create({ email, password: hashedPassword });
      res.status(201).json(user);
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static async login(req, res) {
    const { email, password } = req.body;

    try {
      const user = await authModel.findOne({ where: { email } });
      if (!user) {
        return res.status(401).send("Unauthorized");
      }
      const isMatch = await comparePassword(password, user.password);
      if (isMatch) {
        return res.status(200).json(user);
      } else {
        return res.status(401).send("Unauthorized");
      }
    } catch (error) {
      res.status(500).send("Internal Server Error: " + error.message);
    }
  }

  static logout(req, res) {
    res.status(200).send("OK");
  }

  static async getUser(email) {
    try {
      const user = await authModel.findOne({ where: { email } });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Error getting user");
    }
  }

  static async updateUserLevel(userEmail, newPoints) {
    try {
      // Obtener todos los niveles
      const allLevels = await LevelController.getAllLevels();

      // Determinar el nivel del usuario
      let newUserLevel;
      for (const level of allLevels) {
        if (newPoints >= level.required_experience_points) {
          newUserLevel = level.level_number;
        } else {
          break; // El usuario no cumple los requisitos para el siguiente nivel
        }
      }

      // Actualizar los puntos de experiencia y el nivel del usuario
      await authModel.update(
        { experience_points: newPoints, level: newUserLevel },
        { where: { email: userEmail } }
      );

      console.log("User points and level updated successfully");

      return newUserLevel;
    } catch (error) {
      console.error("Error updating user points and level:", error);
      throw new Error("Error updating user points and level");
    }
  }
}
