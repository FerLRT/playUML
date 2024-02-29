import { classModel } from "../models/class-model.js";

import { AuthController } from "./auth-controller.js";

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

      if (newClass) {
        console.log("Clase creada");
      }

      res.json(newClass);
    } catch (error) {
      console.error("Error creating class:", error);
      res.status(500).send("Internal Server Error: " + error);
    }
  }
}
