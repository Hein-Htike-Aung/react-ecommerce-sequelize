"use strict";

import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { sequelize } from ".";

export interface IParentCategory {
  id: number;
  parentCategoryName: string;
  created_at: Date;
  updated_at: Date;
}

class ParentCategory extends Model<
  InferAttributes<ParentCategory>,
  InferCreationAttributes<ParentCategory>
> {
  declare id: CreationOptional<number>;
  declare parentCategoryName: string;
}

ParentCategory.init(
  {
    id: {
      primaryKey: true,
      type: DataTypes.INTEGER,
      autoIncrement: true,
    },
    parentCategoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: sequelize,
    modelName: "ParentCategory",
    tableName: "parent_category",
    timestamps: true,
    paranoid: false,
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
  }
);

export default ParentCategory;
