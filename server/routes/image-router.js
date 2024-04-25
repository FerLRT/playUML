import { Router } from "express";
import { ImageController } from "../controllers/image-controller.js";
import { requireToken } from "../middlewares/requireToken.js";

export const imageRouter = Router();

imageRouter.get("/:id", requireToken, ImageController.getQuestionImage);
