import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";

import {
  bodyRegisterValidator,
  bodyChangePasswordValidator,
} from "../middlewares/validatorManager.js";

export const authRouter = Router();

authRouter.post("/signup", bodyRegisterValidator, AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);
authRouter.put(
  "/update/:id",
  bodyChangePasswordValidator,
  AuthController.updatePassword
);

authRouter.post("/import", AuthController.importFile);
authRouter.get("/student/:id", AuthController.getStudentStats);
