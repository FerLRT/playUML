import { userClassModel } from "../models/userClass-model.js";

export class UserClassController {
  static async getClassStudents(classId) {
    try {
      const students = await userClassModel.findAll({
        where: { class_id: classId },
      });
      return students;
    } catch (error) {
      console.error("Error getting students:", error);
      throw new Error("Failed to get students");
    }
  }

  static async addUserToClass(userId, classId) {
    try {
      const userClass = await userClassModel.create({
        user_id: userId,
        class_id: classId,
      });
      return userClass;
    } catch (error) {
      console.error("Error adding user to class:", error);
      throw new Error("Failed to add user to class");
    }
  }

  static async removeUserFromClass(userId, classId) {
    try {
      await userClassModel.destroy({
        where: {
          user_id: userId,
          class_id: classId,
        },
      });
      console.log("User removed from class.");
    } catch (error) {
      console.error("Error removing user from class:", error);
      throw new Error("Failed to remove user from class");
    }
  }
}
