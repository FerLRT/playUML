import { Router } from "express";
import { QuestionController } from "../controllers/question-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const questionRouter = Router();

questionRouter.get("/", requireToken, QuestionController.getQuestions);
questionRouter.get("/:id", requireToken, QuestionController.getQuizQuestions);
