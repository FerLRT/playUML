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

// const whiteList = [process.env.ORIGIN1];

// app.use(
//   cors({
//     origin: function (origin, callback) {
//       console.log("😲😲😲 =>", origin);
//       if (!origin || whiteList.includes(origin)) {
//         return callback(null, origin);
//       }
//       return callback("Error de CORS origin: " + origin + " No autorizado!");
//     },
//     credentials: true,
//   })
// );
app.use(cors());

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
