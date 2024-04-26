import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";

import {
  bodyRegisterValidator,
  bodyChangePasswordValidator,
} from "../middlewares/validatorManager.js";

import { requireToken } from "../middlewares/requireToken.js";
import { requireRefreshToken } from "../middlewares/requireRefreshToken.js";

export const authRouter = Router();

authRouter.post("/signup", bodyRegisterValidator, AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);
authRouter.get("/refresh", requireRefreshToken, AuthController.refreshToken);
authRouter.put(
  "/update/:id",
  requireToken,
  bodyChangePasswordValidator,
  AuthController.updatePassword
);
authRouter.post("/import", requireToken, AuthController.importFile);
authRouter.get("/student/:id", requireToken, AuthController.getStudentStats);
authRouter.get("/class/:id", requireToken, AuthController.getUserInfo);
