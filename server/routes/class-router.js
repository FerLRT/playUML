import { Router } from "express";
import { ClassController } from "../controllers/class-controller.js";
import { requireToken } from "../middlewares/requireToken.js";

export const classRouter = Router();

classRouter.get("/:id/name", requireToken, ClassController.getClassName);
classRouter.get("/:id", requireToken, ClassController.getTeacherClasses);
classRouter.post("/", requireToken, ClassController.createClass);
classRouter.get(
  "/:id/students",
  requireToken,
  ClassController.getClassStudents
);
classRouter.get(
  "/:id/average",
  requireToken,
  ClassController.getClassAverageScore
);
classRouter.get(
  "/:id/percentage",
  requireToken,
  ClassController.getClassPercentage
);
classRouter.get(
  "/ranking/:id/:role",
  requireToken,
  ClassController.getClassRanking
);
classRouter.post(
  "/add-student",
  requireToken,
  ClassController.addStudentToClass
);
classRouter.delete(
  "/remove-student/:studentId",
  requireToken,
  ClassController.removeStudent
);
