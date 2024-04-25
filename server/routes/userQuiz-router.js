import { Router } from "express";
import { UserQuizController } from "../controllers/userQuiz-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const userQuizRouter = Router();

userQuizRouter.post(
  "/completed",
  requireToken,
  UserQuizController.hasUserCompletedQuiz
);
userQuizRouter.get(
  "/score/:userId/:quizId",
  requireToken,
  UserQuizController.getUserQuizScore
);
