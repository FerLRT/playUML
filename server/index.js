import express from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { createServer } from "http";
import cors from "cors";

import dotenv from "dotenv";

// Importa las rutas
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

// Crea la instancia de la aplicaciÃ³n Express
const app = express();

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);
app.options(
  process.env.ORIGIN,
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

// Aplica las rutas
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

app.get("/", (req, res) => res.send("Express on Vercel"));

// Normaliza el puerto en el que escucharÃ¡ el servidor
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// Crea el servidor HTTP
const server = createServer(app);

// Escucha en el puerto especificado
server.listen(port, () => {
  console.log(`Servidor en ejecución en el puerto ${port}`);
});

// FunciÃ³n para normalizar el puerto
function normalizePort(val) {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val; // Pipe
  }

  if (port >= 0) {
    return port; // Número de puerto
  }

  return false;
}
