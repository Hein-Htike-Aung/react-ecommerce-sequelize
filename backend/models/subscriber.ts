"use strict";
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from ".";

class Subscriber extends Model<
  InferAttributes<Subscriber>,
  InferCreationAttributes<Subscriber>
> {
  declare id: CreationOptional<number>;
  declare userId: number;
}

Subscriber.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: sequelize,
    modelName: "Subscriber",
    tableName: "subscriber",
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default Subscriber;
