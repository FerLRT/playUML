import { userQuestionAnswerModel } from "../models/userQuestionAnswer-model.js";

export class UserQuestionAnswerController {
  static async createUserQuestionAnswers(
    userId,
    quizId,
    questionId,
    answerIds
  ) {
    try {
      // Buscar si ya existe una entrada para este usuario, quiz y pregunta
      let userQuestionAnswer = await userQuestionAnswerModel.findOne({
        where: { user_id: userId, quiz_id: quizId, question_id: questionId },
      });

      if (userQuestionAnswer) {
        // Si la entrada ya existe, actualizar los answerIds
        userQuestionAnswer.answer_ids = answerIds;
        await userQuestionAnswer.save();
      } else {
        // Si no existe, crear una nueva entrada
        userQuestionAnswer = await userQuestionAnswerModel.create({
          user_id: userId,
          quiz_id: quizId,
          question_id: questionId,
          answer_ids: answerIds,
        });
      }

      return userQuestionAnswer;
    } catch (error) {
      throw new Error(
        `Error creating/updating user question answers: ${error.message}`
      );
    }
  }
}
