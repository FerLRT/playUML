import { userQuizModel } from "../models/userQuiz-model.js";
import { UserQuestionAnswerController } from "./userQuestionAnswer-controller.js";

export class UserQuizController {
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
}
