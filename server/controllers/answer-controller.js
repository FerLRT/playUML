import { answerModel } from "../models/answer-model.js";

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

  static postSubmitAnswers(req, res) {
    const answers = req.body.answers;

    // Array para almacenar los puntajes de cada respuesta
    const scores = [];

    // Promesa para buscar el puntaje de cada respuesta en la base de datos
    const scorePromises = answers.map((answer) => {
      return answerModel
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

    // Esperar a que todas las promesas se resuelvan
    Promise.all(scorePromises)
      .then(() => {
        // Calcular el puntaje total sumando los puntajes individuales
        const totalScore = scores.reduce(
          (total, current) => total + current.score,
          0
        );

        // Crear el objeto de respuesta con las preguntas y sus puntajes
        const response = {
          totalScore: totalScore,
          scores: scores,
        };

        // Devolver la respuesta al cliente
        res.json(response);
      })
      .catch((error) => {
        console.error(
          "Error al obtener los puntajes de las respuestas:",
          error
        );
        res.status(500).send("Internal Server Error");
      });
  }
}
