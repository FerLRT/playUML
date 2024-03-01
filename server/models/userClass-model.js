import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const userClassModel = sequelize.define("user_classes", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "users",
      key: "id",
    },
  },
  class_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "classes",
      key: "id",
    },
  },
});
