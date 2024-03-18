import { Router } from "express";
import { QuizController } from "../controllers/quiz-controller.js";

export const quizRouter = Router();

quizRouter.get("/", QuizController.getQuizzes);
quizRouter.get("/:id", QuizController.getQuiz);
quizRouter.get("/stats/:id", QuizController.getClassStats);
quizRouter.get("/:id/user/:userId", QuizController.getStudentAnswers);
quizRouter.get("/stats/:userId/:quizId", QuizController.getChartStats);
