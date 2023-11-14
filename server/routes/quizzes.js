const express = require("express");
const router = express.Router();
const quizzesController = require("../controllers/quizzesController");

// Rutas específicas para quizzes
router.get("/quizzes", quizzesController.getQuizzes);
router.get("/quizzes/:id", quizzesController.getQuiz);

module.exports = router;
