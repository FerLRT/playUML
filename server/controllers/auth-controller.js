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
      console.error("Error creating user:", error);
      res.status(500).send("Internal Server Error: " + error);
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

      if (!isMatch) {
        return res.status(401).send("Unauthorized");
      }

      res.status(200).json(user);
    } catch (error) {
      console.error("Error during login:", error);
      return res.status(500).send("Internal Server Error");
    }
  }

  static logout(req, res) {
    res.status(200).send("OK");
  }

  static async importFile(req, res) {
    const fileContent = req.body;

    try {
      // Verificar si los datos son válidos (en este caso, un array de estudiantes)
      if (!Array.isArray(fileContent) || fileContent.length === 0) {
        throw new Error("Los datos no son válidos");
      }

      // Realizar cualquier procesamiento adicional necesario en los datos
      console.log("El contenido del archivo es:", fileContent);

      res.status(200).send("OK");
    } catch (error) {
      console.error("Error al procesar el archivo:", error);
      res.status(400).send("Bad Request");
    }
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
      throw new Error("Failed to retrieve user information");
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

      if (!newUserLevel) {
        throw new Error("Could not determine user's new level");
      }

      // Actualizar los puntos de experiencia y el nivel del usuario
      await authModel.update(
        { experience_points: newPoints, level: newUserLevel },
        { where: { email: userEmail } }
      );

      return newUserLevel;
    } catch (error) {
      console.error("Error updating user points and level:", error);
      throw new Error("Failed to update user points and level");
    }
  }
}
