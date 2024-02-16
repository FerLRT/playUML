import { answerModel } from "../models/answer-model.js";
import { QuizController } from "./quiz-controller.js";
import { AuthController } from "./auth-controller.js";

export class AnswerController {
  static getAnswers(req, res) {
    answerModel
      .findAll()
      .then((answers) => {
        res.json(answers);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static getQuestionAnswers(req, res) {
    const questionId = req.params.id;

    answerModel
      .findAll({
        where: { question_id: questionId },
        attributes: { exclude: ["score"] },
      })
      .then(async (answers) => {
        const answersWithBase64Data = await Promise.all(
          answers.map(async (answer) => {
            if (answer.answer_image !== null) {
              // Convertir answer_image a base64
              answer.answer_image = Buffer.from(answer.answer_image).toString(
                "base64"
              );
            }

            return answer;
          })
        );

        res.json(answersWithBase64Data);
      })
      .catch((err) => {
        res.status(500).send("Internal Server Error: " + err);
      });
  }

  static async postSubmitAnswers(req, res) {
    try {
      const userEmail = req.body.userEmail;
      const quizId = req.body.quizId;
      const answers = req.body.answers;

      // Obtener los puntos de conocimiento asociados al quiz
      const quizExperiencePoints =
        await QuizController.getExperiencePointsForQuiz(quizId);

      const user = await AuthController.getUser(userEmail);
      const questionsScores = await AnswerController.getQuestionsScores(
        answers
      );

      const newPoints = user.experience_points + quizExperiencePoints;

      const newLevel =
        (await AuthController.updateUserLevel(userEmail, newPoints)) ||
        user.level;

      // Calcular el puntaje total sumando los puntajes individuales
      const scores = questionsScores.map((answer) => answer.score);
      const totalScore = scores.reduce((total, current) => total + current, 0);

      res
        .status(200)
        .json({
          totalScore: totalScore,
          scores: questionsScores,
          level: newLevel,
          experience: newPoints,
        });
    } catch (error) {
      console.error("Error calculating total score:", error);
      res.status(500).send("Internal Server Error");
    }
  }

  static async getQuestionsScores(answers) {
    const scores = [];

    answers.map(async (answer) => {
      await answerModel
        .findAll({ where: { question_id: answer.questionId } })
        .then((results) => {
          results.forEach((result) => {
            scores.push({
              questionId: answer.questionId,
              answerId: result.id,
              score: result.score,
            });
          });
        })
        .catch((error) => {
          console.error("Error al obtener el puntaje de la respuesta:", error);
        });
    });

    return scores;
  }
}
