import { Router } from "express";
import { QuestionController } from "../controllers/question-controller.js";

export const questionRouter = Router();

questionRouter.get("/", QuestionController.getQuestions);
questionRouter.get("/:id", QuestionController.getQuizQuestions);
