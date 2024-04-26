import { Router } from "express";
import { QuizController } from "../controllers/quiz-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const quizRouter = Router();

quizRouter.get("/user/:userId", requireToken, QuizController.getQuizzes);
quizRouter.get("/:id", requireToken, QuizController.getQuiz);
quizRouter.get("/stats/:id", requireToken, QuizController.getClassStats);
quizRouter.get(
  "/:id/user/:userId",
  requireToken,
  QuizController.getStudentAnswers
);
quizRouter.get(
  "/stats/:userId/:quizId",
  requireToken,
  QuizController.getChartStats
);
