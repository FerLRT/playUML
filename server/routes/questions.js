const express = require("express");
const router = express.Router();
const questionsController = require("../controllers/questionsController");

// Rutas específicas para questions
router.get("/:id", questionsController.getQuizQuestions);

module.exports = router;
