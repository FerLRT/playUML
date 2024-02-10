import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import { questionModel } from "./question-model.js";

export const answerModel = sequelize.define("answers", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  question_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: questionModel,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  answer_text: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  answer_image: {
    type: DataTypes.BLOB("long"),
    allowNull: false,
  },
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});
