import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const userQuestionAnswerModel = sequelize.define(
  "user_question_answers",
  {
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    quiz_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "quizzes",
        key: "id",
      },
    },
    question_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      references: {
        model: "questions",
        key: "id",
      },
    },
    answer_ids: {
      type: DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: false,
    },
  }
);
