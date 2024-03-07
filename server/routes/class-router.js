import { Router } from "express";
import { ClassController } from "../controllers/class-controller.js";

export const classRouter = Router();

classRouter.get("/:id", ClassController.getTeacherClasses);
classRouter.post("/", ClassController.createClass);
classRouter.get("/:id/students", ClassController.getClassStudents);
classRouter.get("/:id/average", ClassController.getClassAverageScore);
classRouter.get("/:id/percentage", ClassController.getClassPercentage);
classRouter.get("/ranking/:id", ClassController.getClassRanking);
