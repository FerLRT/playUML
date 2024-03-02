import { classModel } from "../models/class-model.js";

import { AuthController } from "./auth-controller.js";
import { UserClassController } from "./userClass-controller.js";

export class ClassController {
  static async getTeacherClasses(req, res) {
    try {
      const teacherEmail = req.params.id;

      // Obtener el usuario
      const teacher = await AuthController.getUser(teacherEmail);

      // Obtener las clases asociadas al profesor
      const classes = await classModel.findAll({
        where: { teacher_id: teacher.id },
      });

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
