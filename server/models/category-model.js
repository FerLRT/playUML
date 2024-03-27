import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const categoryModel = sequelize.define("categories", {
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
  unlock_order: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});
