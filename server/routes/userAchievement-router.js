import { Router } from "express";
import { UserAchievementController } from "../controllers/userAchievement-controller.js";

export const userAchievementRouter = Router();

userAchievementRouter.get(
  "/:userId",
  UserAchievementController.getUserAchievements
);
