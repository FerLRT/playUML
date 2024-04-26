import { Router } from "express";
import { LevelController } from "../controllers/level-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const levelRouter = Router();

levelRouter.get(
  "/:level",
  requireToken,
  LevelController.getRequiredPointsForLevel
);
