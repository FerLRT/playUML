const express = require("express");
const router = express.Router();
const answersController = require("../controllers/answersController");

// Rutas específicas para answers
router.get("/:id", answersController.getQuestionAnswers);
router.post("/score", answersController.submitAnswers);

module.exports = router;
