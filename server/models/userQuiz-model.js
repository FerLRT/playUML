import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const userQuizModel = sequelize.define("user_quizzes", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
