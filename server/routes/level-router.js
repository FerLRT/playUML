import { Router } from "express";
import { LevelController } from "../controllers/level-controller.js";

export const levelRouter = Router();

levelRouter.get("/:level", LevelController.getRequiredPointsForLevel);
