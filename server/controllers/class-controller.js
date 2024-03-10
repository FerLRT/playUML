import { classModel } from "../models/class-model.js";

import { AuthController } from "./auth-controller.js";
import { UserClassController } from "./userClass-controller.js";
import { QuizController } from "./quiz-controller.js";

import { sequelize } from "../config/dbConfig.js";

export class ClassController {
  static async getClassName(req, res) {
    try {
      const classId = req.params.id;

      // Obtener el nombre de la clase
      const className = await classModel.findOne({
        where: { id: classId },
        attributes: ["name"],
      });

      res.json(className);
    } catch (error) {
      console.error("Error getting class name:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async getTeacherClasses(req, res) {
    try {
      const teacherEmail = req.params.id;

      // Obtener el usuario
      const teacher = await AuthController.getUser(teacherEmail);

      // Obtener las clases asociadas al profesor
      const classes = await classModel.findAll({
        where: { teacher_id: teacher.id },
      });

      // Iterar sobre cada clase para obtener el número de estudiantes y agregarlo como una propiedad
      for (let i = 0; i < classes.length; i++) {
        const classId = classes[i].id;
        const students = await UserClassController.getClassStudents(classId);
        const numberOfStudents = students.length;
        classes[i].dataValues.numberOfStudents = numberOfStudents;
      }

      res.json(classes);
    } catch (error) {
      console.error("Error getting classes:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async createClass(req, res) {
    try {
      const { name, teacherEmail, fileData } = req.body;

      // Obtener el usuario
      const teacher = await AuthController.getUser(teacherEmail);

      // Crear la clase
      const newClass = await classModel.create({
        name,
        teacher_id: teacher.id,
      });

      let usersCredentials = null;

      if (newClass) {
        // Crear usuarios y asociarlos a la clase
        usersCredentials = await ClassController.createUsersAndAssignToClass(
          fileData,
          newClass
        );
      }

      // Enviar el enlace de descarga al cliente
      res.json({
        newClass: newClass,
        usersCredentials: usersCredentials,
        fileName: `${newClass.name}-credentials.json`,
      });
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async getClassStudents(req, res) {
    try {
      const classId = req.params.id;

      // Obtener los estudiantes de la clase
      const students = await UserClassController.getClassStudents(classId);

      // Extraer los IDs de usuario de los objetos user_classes
      const userIds = students.map((userClass) => userClass.dataValues.user_id);

      // Luego, pasa userIds a tu método getStudentsInfo
      const studentsWithInfo = await AuthController.getStudentsInfo(userIds);

      res.json(studentsWithInfo);
    } catch (error) {
      console.error("Error getting students:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async getClassAverageScore(req, res) {
    try {
      const classId = req.params.id;

      // Consulta para obtener la suma de puntuaciones de cada quiz
      const sumScores = await sequelize.query(`
        SELECT quiz_id, SUM(score) AS total_score
        FROM user_quizzes
        WHERE quiz_id IN (
          SELECT quiz_id
          FROM user_quizzes
          WHERE user_id IN (
            SELECT user_id
            FROM user_classes
            WHERE class_id = ${classId}
          )
        )
        GROUP BY quiz_id
      `);

      // Consulta para obtener el número total de quizzes respondidos por los usuarios en la clase
      const totalQuizzes = await sequelize.query(`
        SELECT COUNT(quiz_id) AS total_quizzes
        FROM user_quizzes
        WHERE user_id IN (
          SELECT user_id
          FROM user_classes
          WHERE class_id = ${classId}
        )
      `);

      // Calcular la suma total de las puntuaciones de los quizzes
      const sumTotalScore = sumScores[0].reduce(
        (total, score) => total + score.total_score,
        0
      );

      // Calcular el número total de quizzes
      const totalQuizzesCount = totalQuizzes[0][0].total_quizzes;

      // Calcular la puntuación promedio de la clase
      const classAverageScore = sumTotalScore / totalQuizzesCount;

      // Devolver la puntuación promedio de la clase
      res.json(classAverageScore.toFixed(2));
    } catch (error) {
      console.error("Error al calcular la nota media de la clase:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async getClassPercentage(req, res) {
    try {
      const classId = req.params.id;

      // Consulta para obtener el número total de quizzes
      const totalQuizzes = await QuizController.getTotalQuizzes();
      const numStudents = await UserClassController.getClassStudents(classId);

      // Consulta para obtener el número de quizzes completados
      const completedQuizzes = await sequelize.query(`
        SELECT COUNT(quiz_id) AS completed_quizzes
        FROM user_quizzes
        WHERE user_id IN (
          SELECT user_id
          FROM user_classes
          WHERE class_id = ${classId}
        )
        AND score IS NOT NULL
      `);

      // Calcular el porcentaje
      const percentage =
        (completedQuizzes[0][0].completed_quizzes /
          (totalQuizzes * numStudents.length)) *
          100 || 0;

      // Devolver el porcentaje de quizzes completados
      res.json(percentage.toFixed(2));
    } catch (error) {
      console.error("Error al calcular el porcentaje de la clase:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async getClassRanking(req, res) {
    try {
      const classId = req.params.id;

      // Obtener las estadísticas de todos los estudiantes
      const studentStats = await ClassController.getClassRankingById(classId);

      // Devolver el array completo de estadísticas de los estudiantes
      res.json(studentStats);
    } catch (error) {
      console.error("Error al obtener el ranking de la clase:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async getClassRankingById(classId) {
    try {
      // Obtener estudiantes de la clase
      const students = await UserClassController.getClassStudents(classId);

      // Obtener el número total de quizzes
      const totalQuizzes = await QuizController.getTotalQuizzes();

      // Array para almacenar las estadísticas de cada estudiante
      const studentStatsPromises = students.map(async (student) => {
        const userId = student.user_id;
        const user = await AuthController.getUserById(userId);

        // Obtener la puntuación promedio del usuario
        const { averageScore, numQuizzes } = await AuthController.getUserStats(
          userId
        );

        // Calcular el porcentaje de quizzes completados
        const completionPercentage = (numQuizzes / totalQuizzes) * 100;

        // Calcular un valor ponderado que tenga en cuenta tanto la nota media como el porcentaje de quizzes completados
        const weightedValue =
          (averageScore * totalQuizzes + completionPercentage) /
          (totalQuizzes + 1);

        return {
          userId: user.email,
          averageScore: averageScore,
          completionPercentage: completionPercentage,
          weightedValue: weightedValue,
        };
      });

      // Esperar a que todas las promesas se resuelvan
      const studentStats = await Promise.all(studentStatsPromises);

      return studentStats;
    } catch (error) {
      console.error("Error al obtener el ranking de la clase:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async createUsersAndAssignToClass(userDataArray, newClass) {
    const usersCredentials = [];

    for (const userData of userDataArray[0]) {
      const { nombre, apellidos, direccindecorreo, grupos } = userData;

      let user = await AuthController.getUser(direccindecorreo);
      const password = Math.random().toString(36).substring(7);

      // Actualizar la contraseña del usuario existente
      if (user) {
        await AuthController.updateUserPassword(direccindecorreo, password);
      }

      // Crear el usuario
      if (!user) {
        user = await AuthController.createUser(direccindecorreo, password);
      }

      // Asociar el usuario a la clase
      if (user) {
        await AuthController.updateCurrentClass(user.email, newClass.id);
        await UserClassController.addUserToClass(user.id, newClass.id);

        // Almacenar las credenciales del usuario creado
        usersCredentials.push({ email: direccindecorreo, password });
      }
    }
    return usersCredentials;
  }
}
