import { Router } from "express";
import { UserQuizController } from "../controllers/userQuiz-controller.js";

export const userQuizRouter = Router();

userQuizRouter.post("/completed", UserQuizController.hasUserCompletedQuiz);
userQuizRouter.get(
  "/score/:userId/:quizId",
  UserQuizController.getUserQuizScore
);
