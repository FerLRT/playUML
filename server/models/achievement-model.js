import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const Achievement = sequelize.define("achievements", {
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
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  badge_url: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  type: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  requirement: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
