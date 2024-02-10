import { Router } from "express";
import { ImageController } from "../controllers/image-controller.js";

export const imageRouter = Router();

imageRouter.get("/:id", ImageController.getQuestionImage);
