import { Router } from "express";
import { AchievementController } from "../controllers/achievement-controller.js";

export const achievementRouter = Router();

achievementRouter.get("/", AchievementController.getAchievements);
achievementRouter.get("/:userId", AchievementController.getUserAchievements);
