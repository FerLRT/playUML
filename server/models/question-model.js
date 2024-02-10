import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import { quizModel } from "./quiz-model.js";

export const questionModel = sequelize.define("questions", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  quiz_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: quizModel,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  question_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
