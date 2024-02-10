import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const quizModel = sequelize.define("quizzes", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});
