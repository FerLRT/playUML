import { Router } from "express";
import { AnswerController } from "../controllers/answer-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const answerRouter = Router();

answerRouter.get("/:id", requireToken, AnswerController.getQuestionAnswers);
answerRouter.post("/user", requireToken, AnswerController.postSubmitAnswers);
answerRouter.get(
  "/scores/:id",
  requireToken,
  AnswerController.getQuestionAnswersWithScores
);
