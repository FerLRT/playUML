import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";
import { questionModel } from "./question-model.js";

export const imageModel = sequelize.define("images", {
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
  image_data: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});
