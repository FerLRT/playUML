import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import "dotenv/config";

// Routes
import { authRouter } from "./routes/auth-router.js";

import { quizRouter } from "./routes/quiz-router.js";
import { questionRouter } from "./routes/question-router.js";
import { answerRouter } from "./routes/answer-router.js";
import { imageRouter } from "./routes/image-router.js";
import { levelRouter } from "./routes/level-router.js";
import { achievementRouter } from "./routes/achievement-router.js";
import { userAchievementRouter } from "./routes/userAchievement-router.js";
import { userQuizRouter } from "./routes/userQuiz-router.js";
import { classRouter } from "./routes/class-router.js";

export const app = express();

const allowCors = (fn) => async (req, res) => {
  const whiteList = [process.env.ORIGIN1];

  const origin = req.headers.origin;

  console.log("Origin:", origin);
  console.log("WhiteList:", whiteList);
  console.log("Headers:", req.headers);

  if (whiteList.includes(origin)) {
    // Si el origen de la solicitud está en la lista blanca, se permite la solicitud
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET,OPTIONS,PATCH,DELETE,POST,PUT"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
    );

    if (req.method === "OPTIONS") {
      res.status(200).end();
      return;
    }

    return await fn(req, res);
  } else {
    // Si el origen de la solicitud no está en la lista blanca, se rechaza la solicitud
    res
      .status(403)
      .send("Solicitud no autorizada debido a restricciones de CORS.");
  }
};

const handler = (req, res) => {
  const d = new Date();
  res.end(d.toString());
};

// Aplica el middleware allowCors a todas las rutas
app.use(allowCors(handler));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/auth", authRouter);

app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);
app.use("/images", imageRouter);
app.use("/levels", levelRouter);
app.use("/achievements", achievementRouter);
app.use("/user-achievements", userAchievementRouter);
app.use("/user-quizzes", userQuizRouter);
app.use("/classes", classRouter);
