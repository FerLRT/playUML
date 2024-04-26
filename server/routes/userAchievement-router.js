import { Router } from "express";
import { UserAchievementController } from "../controllers/userAchievement-controller.js";

import { requireToken } from "../middlewares/requireToken.js";

export const userAchievementRouter = Router();

userAchievementRouter.get(
  "/:userId",
  requireToken,
  UserAchievementController.getUserAchievements
);
