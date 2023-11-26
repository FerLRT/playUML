const express = require("express");
const router = express.Router();
const quizzesController = require("../controllers/quizzesController");

// Rutas específicas para quizzes
router.get("/", quizzesController.getQuizzes);
router.get("/:id", quizzesController.getQuiz);

module.exports = router;
