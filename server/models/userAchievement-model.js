import { DataTypes } from "sequelize";
import { sequelize } from "../config/dbConfig.js";

export const UserAchievement = sequelize.define("user_achievements", {
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "users",
      key: "id",
    },
    onDelete: "CASCADE",
  },
  achievement_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: {
      model: "achievements",
      key: "id",
    },
    onDelete: "CASCADE",
  },
});
