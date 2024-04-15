import { Router } from "express";
import { AuthController } from "../controllers/auth-controller.js";

import { bodyRegisterValidator } from "../middlewares/validatorManager.js";

export const authRouter = Router();

authRouter.post("/signup", bodyRegisterValidator, AuthController.signup);
authRouter.post("/login", AuthController.login);
authRouter.get("/logout", AuthController.logout);

authRouter.post("/import", AuthController.importFile);
authRouter.get("/student/:id", AuthController.getStudentStats);
// authRouter.get("/usermail", AuthController.infoUser);
// authRouter.get("/refresh", AuthController.refreshToken);

// authRouter.post("/signup", bodyRegisterValidator, AuthController.signup);
// authRouter.post("/login", bodyLoginValidator, AuthController.login);

// authRouter.get("/usermail", requireToken, AuthController.infoUser);
// authRouter.get("/refresh", requireRefreshToken, AuthController.refreshToken);
// authRouter.get("/logout", AuthController.logout);
