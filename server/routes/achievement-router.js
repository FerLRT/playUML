import { Router } from "express";
import { AchievementController } from "../controllers/achievement-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const achievementRouter = Router();

achievementRouter.get("/", requireToken, AchievementController.getAchievements);
achievementRouter.get(
  "/:userId",
  requireToken,
  AchievementController.getUserAchievements
);
