const pool = require("../config/dbConfig");

const getQuizzes = async () => {
  try {
    const query = "SELECT * FROM quizzes";
    const result = await pool.query(query);

    return result.rows;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

const getQuizById = async (quizId) => {
  try {
    const query = "SELECT * FROM quizzes WHERE id = $1";
    const result = await pool.query(query, [quizId]);

    return result.rows;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  getQuizzes,
  getQuizById,
};
