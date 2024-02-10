import { Router } from "express";
import { AnswerController } from "../controllers/answer-controller.js";

export const answerRouter = Router();

answerRouter.get("/:id", AnswerController.getQuestionAnswers);
answerRouter.post("/user", AnswerController.postSubmitAnswers);
