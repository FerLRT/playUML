import { authModel } from "../models/auth-model.js";
import { hashPassword, comparePassword } from "../utils/user-utils.js";
import { LevelController } from "./level-controller.js";
import { UserQuizController } from "./userQuiz-controller.js";

import { sequelize } from "../config/dbConfig.js";
import { QuizController } from "./quiz-controller.js";
import { ClassController } from "./class-controller.js";

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
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting user:", error);
      throw new Error("Failed to retrieve user information");
    }
  }

  static async getUserById(userId) {
    try {
      const user = await authModel.findByPk(userId);

      if (!user) {
        return null;
      }

      return user;
    } catch (error) {
      console.error("Error getting user by ID:", error);
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

  static async createUser(email, password) {
    try {
      const hashedPassword = await hashPassword(password);
      const user = await authModel.create({ email, password: hashedPassword });

      return user;
    } catch (error) {
      console.error("Error creating user:", error);
      throw new Error("Failed to create user");
    }
  }

  static async updateUserPassword(email, newPassword) {
    try {
      const hashedPassword = await hashPassword(newPassword);
      await authModel.update(
        { password: hashedPassword },
        { where: { email } }
      );
    } catch (error) {
      console.error("Error updating user password:", error);
      throw new Error("Failed to update user password");
    }
  }

  static async updateCurrentClass(email, classId) {
    try {
      await authModel.update(
        { current_class_id: classId },
        { where: { email } }
      );
    } catch (error) {
      console.error("Error updating user's current class:", error);
      throw new Error("Failed to update user's current class");
    }
  }

  static async getStudentsInfo(studentsIds) {
    try {
      const studentsInfo = await authModel.findAll({
        where: { id: studentsIds },
        attributes: ["id", "email", "level"],
      });

      return studentsInfo;
    } catch (error) {
      console.error("Error getting students info:", error);
      throw new Error("Failed to retrieve students information");
    }
  }

  static async getStudentStats(req, res) {
    try {
      const studentId = req.params.id;

      const student = await AuthController.getUserById(studentId);

      let { averageScore, numQuizzes } = await AuthController.getUserStats(
        studentId
      );
      const totalQuizzes = await QuizController.getTotalQuizzes();

      let completionPercentage = (numQuizzes / totalQuizzes) * 100;

      averageScore = averageScore.toFixed(2);
      completionPercentage = completionPercentage.toFixed(2);

      const positionRanking = await AuthController.getStudentRankingPosition(
        student.current_class_id,
        student.email
      );

      const studentEmail = student.email;

      if (numQuizzes == 0) {
        averageScore = NaN;
      }

      res.json({
        studentEmail,
        positionRanking,
        averageScore,
        completionPercentage,
      });
    } catch (error) {
      console.error("Error getting student stats:", error);
      throw new Error("Failed to retrieve student stats");
    }
  }

  static async getStudentRankingPosition(classId, userId) {
    try {
      // Obtener el ranking de la clase
      const studentStats = await ClassController.getClassRankingById(classId);

      // Ordenar el ranking en función del weightedValue
      const sortedRanking = studentStats.sort(
        (a, b) => b.weightedValue - a.weightedValue
      );

      // Buscar el índice del estudiante en el ranking
      const studentIndex = sortedRanking.findIndex(
        (student) => student.userId === userId
      );

      // Si el estudiante no se encuentra en el ranking, devolver -1
      if (studentIndex === -1) {
        return -1;
      }

      // Devolver la posición del estudiante (índice + 1)
      return studentIndex + 1;
    } catch (error) {
      console.error(
        "Error al obtener la posición del estudiante en el ranking:",
        error
      );
      throw error;
    }
  }

  static async getUserStats(userId) {
    try {
      // Obtener los quizzes completados por el usuario con sus puntuaciones
      const userQuizzes = await UserQuizController.getUserQuizzes(userId);

      let totalScore = 0;

      // Para cada quiz completado por el usuario
      for (const quiz of userQuizzes) {
        totalScore += quiz.score;
      }

      const numQuizzes = userQuizzes.length;

      // Calcular la puntuación media sobre 10
      const averageScore = numQuizzes > 0 ? totalScore / numQuizzes : 0;

      return { averageScore, numQuizzes };
    } catch (error) {
      console.error("Error fetching user stats:", error);
      throw error;
    }
  }
}
