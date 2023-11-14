const pool = require("../config/dbConfig");
const imagesModel = require("./images");

const getQuestionsByQuizId = async (quizId) => {
  try {
    const query = "SELECT * FROM questions WHERE quiz_id = $1";
    const result = await pool.query(query, [quizId]);
    const questions = result.rows;

    const questionsWithImages = await Promise.all(
      questions.map(async (question) => {
        // Obtener imágenes desde el modelo de imágenes
        const images = await imagesModel.getImagesByQuestionId(question.id);

        // Agregar las imágenes a la pregunta
        return {
          ...question,
          images: images,
        };
      })
    );

    return questionsWithImages;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

// const getQuestions = async () => {
//   try {
//     const questionsResult = await pool.query("SELECT * FROM questions");
//     const questions = questionsResult.rows;

//     const questionsWithImages = await Promise.all(
//       questions.map(async (question) => {
//         // Obtener imágenes desde el modelo de imágenes
//         const images = await imagesModel.getImagesByQuestionId(question.id);

//         // Agregar las imágenes a la pregunta
//         return {
//           ...question,
//           images: images,
//         };
//       })
//     );

//     return questionsWithImages;
//   } catch (err) {
//     console.error(err.message);
//     throw err;
//   }
// };

module.exports = {
  getQuestionsByQuizId,
  // getQuestions,
};
