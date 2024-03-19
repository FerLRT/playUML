import { userQuizModel } from "../models/userQuiz-model.js";
import { UserQuestionAnswerController } from "./userQuestionAnswer-controller.js";
import { AuthController } from "./auth-controller.js";
import { AnswerController } from "./answer-controller.js";

export class UserQuizController {
  static async hasUserCompletedQuiz(req, res) {
    try {
      // Obtener el email del usuario y el quizId de la solicitud
      const userEmail = req.body.userEmail;
      const quizId = req.body.quizId;

      // Buscar el usuario por su email para obtener su userId
      const user = await AuthController.getUser(userEmail);

      if (!user) {
        throw new Error(`User with email ${userEmail} not found.`);
      }

      // Consultar si hay un registro para el usuario y el quiz específico
      const existingUserQuiz = await userQuizModel.findOne({
        where: { user_id: user.id, quiz_id: quizId },
      });

      // Si se encuentra un registro, el usuario ha completado el quiz
      const hasCompletedQuiz = !!existingUserQuiz;

      let userAnswersForQuiz = [];
      let userAnswersScores = [];

      // Si el usuario ha completado el quiz, obtener sus respuestas
      if (hasCompletedQuiz) {
        userAnswersForQuiz =
          await UserQuestionAnswerController.getUserQuestionAnswers(
            user.id,
            quizId
          );

        userAnswersScores = await AnswerController.getQuestionsScores(
          userAnswersForQuiz
        );

        userAnswersForQuiz = userAnswersForQuiz.map(
          (answer) => answer.selectedAnswerIds
        );
      }

      res
        .status(200)
        .json({ hasCompletedQuiz, userAnswersForQuiz, userAnswersScores });
    } catch (error) {
      console.error(`Error checking if user completed quiz: ${error.message}`);
      res.status(500).json({
        error: `Error checking if user completed quiz: ${error.message}`,
      });
    }
  }

  static async getUserQuizScore(req, res) {
    try {
      // Obtener el email del usuario y el quizId de la solicitud
      const userId = req.params.userId;
      const quizId = req.params.quizId;

      // Consultar si hay un registro para el usuario y el quiz específico
      const existingUserQuiz = await userQuizModel.findOne({
        where: { user_id: userId, quiz_id: quizId },
      });

      // Si se encuentra un registro, devolver la puntuación del usuario
      if (existingUserQuiz) {
        res.status(200).json({ score: existingUserQuiz.score });
      } else {
        res.status(200).json({ score: null });
      }
    } catch (error) {
      console.error(`Error getting user quiz score: ${error.message}`);
      res
        .status(500)
        .json({ error: `Error getting user quiz score: ${error.message}` });
    }
  }

  static async createUserQuiz(userId, quizId, score, answers) {
    try {
      // Consultar si ya hay resultados almacenados para este usuario y este quiz
      let existingUserQuiz = await userQuizModel.findOne({
        where: { user_id: userId, quiz_id: quizId },
      });

      if (existingUserQuiz) {
        // Si ya existen resultados, comparar el totalScore con los anteriores
        if (score > existingUserQuiz.score) {
          // Si el totalScore del nuevo resultado es mayor, actualizar los resultados
          existingUserQuiz = await existingUserQuiz.update({
            score: score,
          });
          const existingUserQuestionAnswers = await Promise.all(
            answers.map(async (answer) => {
              try {
                const questionId = answer.questionId;
                const selectedAnswerIds = answer.selectedAnswerIds || [];
                return await UserQuestionAnswerController.createUserQuestionAnswers(
                  userId,
                  quizId,
                  questionId,
                  selectedAnswerIds
                );
              } catch (error) {
                console.error(
                  `Error creating user question answers: ${error.message}`
                );
                // Retornar null u otro valor para manejar el error según sea necesario
                return null;
              }
            })
          );

          return { existingUserQuiz, existingUserQuestionAnswers };
        } else {
          // Si el totalScore del nuevo resultado no es mayor, no guardar los nuevos resultados
          return existingUserQuiz;
        }
      } else {
        // Si no hay resultados almacenados, crear un nuevo registro
        const newUserQuiz = await userQuizModel.create({
          user_id: userId,
          quiz_id: quizId,
          score: score,
        });

        const newUserQuestionAnswers = await Promise.all(
          answers.map(async (answer) => {
            try {
              const questionId = answer.questionId;
              const selectedAnswerIds = answer.selectedAnswerIds || [];
              return await UserQuestionAnswerController.createUserQuestionAnswers(
                userId,
                quizId,
                questionId,
                selectedAnswerIds
              );
            } catch (error) {
              console.error(
                `Error creating user question answers: ${error.message}`
              );
              // Retornar null u otro valor para manejar el error según sea necesario
              return null;
            }
          })
        );

        return { newUserQuiz, newUserQuestionAnswers };
      }
    } catch (error) {
      throw new Error(`Error creating user quiz: ${error.message}`);
    }
  }

  static async getUserQuizzes(userId) {
    try {
      // Consulta para obtener los quizzes completados por el usuario con sus puntuaciones
      const userQuizzes = await userQuizModel.findAll({
        where: { user_id: userId },
      });

      return userQuizzes;
    } catch (error) {
      console.error("Error fetching user quizzes:", error);
      throw error;
    }
  }

  static async getUserQuizMaxScore(userId, quizId) {
    try {
      // Consulta para obtener la puntuación máxima del usuario en un quiz específico
      const maxScore = await userQuizModel.max("score", {
        where: { user_id: userId, quiz_id: quizId },
      });

      return maxScore || 0;
    } catch (error) {
      console.error("Error fetching user quiz max score:", error);
      throw error;
    }
  }
}
