import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const authModel = sequelize.define("users", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  experience_points: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 1,
  },
  role: {
    type: DataTypes.STRING(20),
    allowNull: false,
    defaultValue: "estudiante",
  },
});
