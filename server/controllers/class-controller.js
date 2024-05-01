import { classModel } from "../models/class-model.js";
import { authModel } from "../models/auth-model.js";

import { AuthController } from "./auth-controller.js";
import { UserClassController } from "./userClass-controller.js";
import { QuizController } from "./quiz-controller.js";

import { sendCredentialsEmail } from "../utils/mail-utils.js";

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
      const uid = req.params.id;

      // Obtener el usuario
      const teacher = await AuthController.getUserById(uid);

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
      const { name, uid, fileData } = req.body;

      // Obtener el usuario
      const teacher = await AuthController.getUserById(uid);

      const classData = {
        name,
        teacher_id: teacher.id,
      };

      const createdClasses = [];
      let usersCredentials = [];
      let fileName = "";

      // Mapear los datos del archivo y agrupar los alumnos por grupo
      const groupedStudents = {};
      for (const studentGroup of fileData) {
        for (const student of studentGroup) {
          const group = student.grupos || "SinGrupo"; // Usar 'SinGrupo' si no se proporciona un grupo
          if (!groupedStudents[group]) {
            groupedStudents[group] = [];
          }
          groupedStudents[group].push(student);
        }
      }

      // Recorrer los grupos y crear una clase por grupo
      for (const [group, students] of Object.entries(groupedStudents)) {
        const className = group !== "SinGrupo" ? `${name}_${group}` : name;
        const groupClassData = {
          ...classData,
          name: `${className}`, // Nombre de la clase: nombre_grupo
        };

        // Crear la clase
        const newClass = await classModel.create(groupClassData);

        // Asociar estudiantes a la clase
        let studentsCredentials = [];
        if (students.length > 0) {
          studentsCredentials =
            await ClassController.createUsersAndAssignToClass(
              [students],
              newClass
            );
        }

        // Obtener el número de estudiantes en la clase
        const numberOfStudents =
          await ClassController.getNumberOfStudentsInClass(newClass.id);

        createdClasses.push({
          id: newClass.id,
          name: newClass.name,
          description: newClass.description,
          teacher_id: newClass.teacher_id,
          numberOfStudents: numberOfStudents,
        });

        // Concatenar las credenciales de los estudiantes al arreglo general
        usersCredentials = usersCredentials.concat(studentsCredentials);
      }

      fileName = `${name}-credentials.json`;

      res.json({
        newClasses: createdClasses,
        usersCredentials: usersCredentials, // Incluir las credenciales de los usuarios en la respuesta
        fileName: fileName,
      });
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }

  static async addStudentToClass(req, res) {
    try {
      const { studentEmail, classId } = req.body;

      // Obtener el usuario
      let student = await AuthController.getUser(studentEmail);
      const password = Math.random().toString(36).substring(7);

      // Actualizar la contraseña del usuario existente
      if (student) {
        await AuthController.updateUserPassword(studentEmail, password);
      }

      // Crear el usuario
      if (!student) {
        student = await AuthController.createUser(studentEmail, password);
      }

      // Asociar el usuario a la clase
      if (student) {
        await AuthController.updateCurrentClass(student.email, classId);
        await UserClassController.addUserToClass(student.id, classId);

        // Enviar correo electrónico al usuario con sus credenciales
        await sendCredentialsEmail(studentEmail, password);
      }

      const formattedNewStudent = {
        email: student.email,
        id: student.id,
        last_connection: student.last_connection,
        level: student.level,
      };

      const userCredentials = {
        email: studentEmail,
        password: password,
      };

      res.json({
        newStudent: formattedNewStudent,
        userCredentials: userCredentials,
        fileName: `new-student-credentials.json`,
      });
    } catch (error) {
      console.error("Error adding student to class:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async removeStudent(req, res) {
    try {
      const { studentId } = req.params;
      console.log(studentId);

      await authModel.destroy({
        where: { id: studentId },
        cascade: true, // Esto eliminará automáticamente las entradas relacionadas
      });
    } catch (error) {
      console.error("Error al eliminar usuario", error);
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
        SELECT uq.quiz_id, SUM(uq.score) AS total_score
        FROM user_quizzes uq
        JOIN user_classes uc ON uq.user_id = uc.user_id
        WHERE uc.class_id = ${classId}
        GROUP BY uq.quiz_id;
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
      const role = req.params.role;

      // Obtener las estadísticas de todos los estudiantes
      const studentStats = await ClassController.getClassRankingById(
        classId,
        role
      );

      // Devolver el array completo de estadísticas de los estudiantes
      res.json(studentStats);
    } catch (error) {
      console.error("Error al obtener el ranking de la clase:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  static async getClassRankingById(classId, role) {
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

        // Calcular número de intentos
        const attempts = await AuthController.getUserAttempts(userId);

        // Calcular un valor ponderado que tenga en cuenta tanto la nota media como el porcentaje de quizzes completados
        const weightedValue = +(
          (averageScore * totalQuizzes + completionPercentage) /
            (totalQuizzes + 1) -
          attempts * 0.1
        ).toFixed(2);

        if (role === "profesor") {
          return {
            userId: user.email,
            averageScore: averageScore,
            completionPercentage: completionPercentage,
            weightedValue: weightedValue,
          };
        }

        return {
          userId: user.email,
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

        // Enviar correo electrónico al usuario con sus credenciales
        await sendCredentialsEmail(direccindecorreo, password);
      }
    }
    return usersCredentials;
  }

  static async getNumberOfStudentsInClass(classId) {
    const students = await UserClassController.getClassStudents(classId);
    return students.length;
  }
}
