import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const levelModel = sequelize.define("levels", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  level_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  required_experience_points: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
