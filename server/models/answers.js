const pool = require("../config/dbConfig");

const getAnswersByQuestionId = async (questionId) => {
  try {
    const query =
      "SELECT id, question_id, answer_text, answer_image FROM answers WHERE question_id = $1";
    const result = await pool.query(query, [questionId]);

    // Convertir image_data a base64
    const answersWithBase64Data = result.rows.map((row) => ({
      ...row,
      answer_image: row.answer_image
        ? Buffer.from(row.answer_image).toString("base64")
        : null,
    }));

    return answersWithBase64Data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// const getAnswersByQuestionId = async (questionId) => {
//   try {
//     const query =
//       "SELECT id, question_id, answer_text, answer_image FROM answers WHERE question_id = $1";
//     const result = await pool.query(query, [questionId]);

//     return result.rows;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };

//----------------------------------------------------------
// Modificar para que dado el id de un test devuelva las respuestas correctas
const getCorrectAnswersForQuestions = async (questionIds) => {
  try {
    // Extraer los IDs de las preguntas de los objetos en questionIds
    const questionIdsArray = questionIds.map((item) => item.questionId);

    const query =
      "SELECT id, question_id FROM answers WHERE question_id = ANY($1) AND is_correct = true";
    const result = await pool.query(query, [questionIdsArray]);

    // Realizar la transformación de los resultados para que coincidan con el formato deseado
    const correctAnswers = result.rows.map((row) => ({
      questionId: row.question_id,
      answerId: row.id,
    }));

    return correctAnswers;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  getAnswersByQuestionId,
  getCorrectAnswersForQuestions,
};
