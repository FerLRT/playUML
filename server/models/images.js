const pool = require("../config/dbConfig");

const getImagesByQuestionId = async (questionId) => {
  try {
    const query = "SELECT * FROM images WHERE question_id = $1";
    const result = await pool.query(query, [questionId]);
    const imagesWithBase64Data = result.rows.map((row) => ({
      ...row,
      image_data: Buffer.from(row.image_data).toString("base64"),
    }));

    return imagesWithBase64Data;
  } catch (err) {
    console.error(err.message);
    throw err;
  }
};

module.exports = {
  getImagesByQuestionId,
};
