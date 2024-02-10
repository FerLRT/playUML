import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import "dotenv/config";

// Falta poner las rutas
import { quizRouter } from "./routes/quiz-router.js";
import { questionRouter } from "./routes/question-router.js";
import { answerRouter } from "./routes/answer-router.js";
import { imageRouter } from "./routes/image-router.js";

export const app = express();

app.use(cors());

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/quizzes", quizRouter);
app.use("/questions", questionRouter);
app.use("/answers", answerRouter);
app.use("/images", imageRouter);
// app.use("/", indexRouter);
// app.use("/users", usersRouter);
