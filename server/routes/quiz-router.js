import { Router } from "express";
import { QuizController } from "../controllers/quiz-controller.js";

export const quizRouter = Router();

quizRouter.get("/", QuizController.getQuizzes);
quizRouter.get("/:id", QuizController.getQuiz);
